import { getOrders, createOrModifyOrder, write, getOrder, getOrderByStatus, getPizza, getPizzas } from './database.js';
import { OrderStatuses, Status } from '../models/models.js';

/**
 * Returns all orders. If {user} is passed, it filters by 'user'
 */
export function listOrders(user) {
  return getOrders(user);
}

/**
 * Returns the order with given ID
 */
export function getSingleOrder(id) {
  return getOrder(id);
}

export function getSinglePizza(name) {
  return getPizza(name);
}

/**
 * Returns all order in 'pending'. If {user} is passed, it filters by user
 */
export function getPendingOrders(user) {
  return getOrderByStatus(Status.pending, user);
}

/**
 * Returns all pizzas in menu
 */
export function getPizzasMenu() {
  return getPizzas();
}

/**
 * Saves new order
 */
export function newOrder(order) {
  // check data
  if ( !order.user ) {
    throw new Error('order must have a user');
  }
  if ( !order.pizzas || order.pizzas.length <= 0 ) {
    throw new Error('order must have at least one pizza. See menu ;)');
  }

  // generate a new timestamp
  order.time = new Date().getTime();

  // save new order into DB
  return createOrModifyOrder( order );
}

/**
 * Moves order to next step
 */
export function nextStepOrder(order) {

  if (order.status === Status.rejected ) {
    throw new Error('cannot move order bacause of it is rejected');
  }

  if ( order.status === Status.pending ) {
    // chef is moving order from 'pending' to 'progress'.
    // He can have move only one order to 'progress' status
    const inProgressOrders = getOrderByStatus( Status.progress );

    if ( inProgressOrders.length > 0 ) {
      throw new Error('Only one order can be in \'progress\'');
    }
  }

  const index = OrderStatuses.indexOf( order.status );
  if (index === OrderStatuses.length - 1) {
    throw new Error('order has been already delivered');
  }
  const newOrder = write(() => {
    order.status = OrderStatuses[ index + 1 ];
    return createOrModifyOrder(order);
  });

  return newOrder;
}

/**
 * Rejects the order
 */
export function rejectOrder(order) {

  const newOrder = write(() => {
    order.status = Status.rejected;
    return createOrModifyOrder(order);
  });

  return newOrder;

}