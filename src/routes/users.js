import { Router } from 'express';
import { getSinglePizza, listOrders, newOrder } from '../services/actions.js';


const Routes = Router();


/**
 * Get my-orders list
 */
Routes.get('/:userId/orders', async function listOrderHandler(req, res, next) {

  const { userId } = req.params;

  const myOrders = listOrders(userId );

  res.set('content-type', 'application/json');
  res.send( JSON.stringify(myOrders) );
});


/**
 * Submit a new order for pizzas
 */
Routes.post('/:userId/orders', async function newOrderHandler(req, res, next) {

  const { userId } = req.params;
  const { pizzas } = req.body;

  const pizzasOnMenu = pizzas.map(pizzaName => getSinglePizza(pizzaName));

  const hasInvalidPizza = pizzasOnMenu.filter(pizza => !pizza);
  if ( hasInvalidPizza.length > 0) {
    return res.status(400).end('invalid pizza');
  }

  const order = {
    user: userId,
    pizzas: pizzasOnMenu
  };

  const orderDB = newOrder(order);

  res.set('content-type', 'application/json');
  res.status(202).end( JSON.stringify(orderDB) );
});

export default Routes;