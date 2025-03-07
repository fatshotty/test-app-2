import React, { useEffect, useRef, useState } from 'react';
import { Badge, Button, Col, Container, Row } from 'react-bootstrap';
import { loadOrders, submitNewOrder, usePizzas } from '../utils';
import { Order, Statuses } from '../types';

export type UserProps = {
  user: string;
}

export function UserView(props: UserProps) {
  const [ orderInProgress, setOrderInProgress ] = useState<boolean>(false);
  const pizzas = usePizzas();
  const refPizzas = useRef<HTMLSelectElement>(null);

  const [ orders, setOrders ] = useState<Order[]>([]);
  
  async function loadListOrders() {
    const listOrders = await loadOrders(props.user);
    setOrders(listOrders);
  }

  useEffect(() => {
    loadListOrders();
  }, [])

  async function submitOrder() {
    const { selectedOptions } = refPizzas.current;
    
    const pizzaNames = Array.prototype.map.call(selectedOptions, (opt: HTMLOptionElement) => opt.value);
    if (pizzaNames.length > 0) {
      // call new order API
      setOrderInProgress(true);
      try {
        await submitNewOrder(props.user, pizzaNames);
        await loadListOrders();
      } catch(e) {
        // TODO: show custom error message
        alert(e);
      } finally {
        setOrderInProgress(false);
      }
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
        <Col className="col-md-4">
          <span className="fw-bold">Order Code</span>
        </Col>
        <Col className="col-md-4">
          <span className="fw-bold">Pizzas</span>
        </Col>
        <Col className="col-md-4">
          <span className="fw-bold">Status</span>
        </Col>
      </Row>
      {orders.map((order, i) => {
        return (
          <Row key={`order-${order.code}`} >
            <Col className="col-md-4">
              <span>{order.code}</span>
            </Col>
            <Col className="col-md-4">
              <span>{order.pizzas.map(p => p.name).join(', ')}</span>
            </Col>
            <Col className="col-md-4">
              <Badge bg={
                order.status == Statuses.ready ? 
                  'success' :
                    (order.status == Statuses.progress ? 
                      'primary' : (order.status === Statuses.rejected ? 'danger' : 'secondary') )} className="fst-italic">{order.status}</Badge>
            </Col>
          </Row>
        );
      })}
      <hr />
      <Row>
        <Col className="col-md-1">
          <select ref={refPizzas} multiple={true} >
            {pizzas.map((pizza, i) => {
              return (
                <option value={pizza.name} key={pizza.name}>{pizza.name}</option>
              )
            })}
          </select>
        </Col>
        <Col className="col-md-2">
          <Button onClick={() => submitOrder()} disabled={orderInProgress}>Send order</Button>
        </Col>
      </Row>
    </Container>
  );
}