import { Router } from 'express';
import { getSingleOrder, listOrders, nextStepOrder, rejectOrder } from '../services/actions.js';

const Routes = Router();

/**
 * Returns all orders list for chef
 */
Routes.get('/orders', async function listOrdersHandler(req, res, next) {
  const orders = listOrders();

  res.set('content-type', 'application/json');
  res.send(JSON.stringify(orders));
});


/**
 * Move order to next step
 */
Routes.put('/orders/:orderId', async function nextStepOrderHandler(req, res, next) {
  const { orderId } = req.params;
  let order = getSingleOrder(orderId);
  if ( !order ) {
    res.status(404).end();
    return;
  }

  try {
    order = nextStepOrder(order);
  } catch (e) {
    console.log(e);
    res.status(400).end(e.toString());
    return;
  }

  res.set('content-type', 'application/json');
  res.status(202).end( JSON.stringify(order) );

});


/**
 * Chef can reject the order
 */
Routes.delete('/orders/:orderId', async function rejectOrderHandler(req, res, next) {

  const { orderId } = req.params;
  let order = getSingleOrder(orderId);
  if ( !order ) {
    res.status(404).end();
    return;
  }

  order = rejectOrder(order);

  res.set('content-type', 'application/json');
  res.status(202).end( JSON.stringify(order) );

});

export default Routes;