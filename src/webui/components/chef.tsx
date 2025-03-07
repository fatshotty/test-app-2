import React, { useEffect, useState } from 'react';
import { Badge, Button, Col, Container, Row } from 'react-bootstrap';
import { loadOrders } from '../utils';
import { Order, Statuses } from '../types';

export function ChefView() {

  const [ orders, setOrders ] = useState<Order[]>([]);

  async function loadListOrders() {
    const listOrders = await loadOrders();
    setOrders(listOrders);
  }

  useEffect(() => {
    loadListOrders();
  }, []);

  async function moveOrder(order: Order) {
    try {
      const res = await fetch(`/chef/orders/${order._id}`, {
        method: 'put'
      });

      // we have to check the res.status because it won't throw errors
      if (res.status >= 200 && res.status < 300) {
        // everything ok, reload list orders
        await loadListOrders();
      } else {
        throw await res.text();
      }
    } catch(e) {
      // TODO: show custom error message
      alert(e);
    }

  }

  async function rejectOrder(order: Order) {
    try {
      const res = await fetch(`/chef/orders/${order._id}`, {
        method: 'delete'
      });
      if (res.status >= 200 && res.status < 300) {
        // everything ok, reload list orders
        await loadListOrders();
      } else {
        throw await res.text();
      }
    } catch (e) {
      alert(e);
    }
  }

  return (
    <Container>
      <Row className="d-flex justify-content-end">
        <Col className="col-md-3">
          <Button onClick={() => loadListOrders()} className="fst-italic" size="sm" variant="outline-secondary">Update list</Button>
        </Col>
      </Row>
      <Row >
        <Col className="col-md-3">
          <span className="fw-bold">Customer</span>
        </Col>
        <Col className="col-md-3">
          <span className="fw-bold">Pizzas</span>
        </Col>
        <Col className="col-md-3">
          <span className="fw-bold">Status</span>
        </Col>
      </Row>
      {orders.map((order, i) => {
        return (
          <Row key={`order-${order.code}`} >
            <Col className="col-md-3">
              <span>{order.user}</span>
            </Col>
            <Col className="col-md-3">
              <span>{order.pizzas.map(p => p.name).join(', ')}</span>
            </Col>
            <Col className="col-md-3">
              <Badge bg={
                order.status == Statuses.ready ? 
                  'success' :
                    (order.status == Statuses.progress ? 
                      'primary' : (order.status === Statuses.rejected ? 'danger' : 'secondary') )} className="fst-italic">{order.status}</Badge>
            </Col>
            <Col className="col-md-3">
              {order.status !== Statuses.ready && order.status !== Statuses.rejected && (<Button onClick={() => moveOrder(order)} variant="outline-primary" size="sm">Move Order</Button>)}
              {order.status === Statuses.pending && (<Button onClick={() => rejectOrder(order)} variant="outline-danger" size="sm">Reject Order</Button>)}
            </Col>
          </Row>
        );
      })}
    </Container>
  );
}