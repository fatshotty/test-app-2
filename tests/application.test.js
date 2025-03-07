import { describe, test, expect, beforeAll, beforeEach, afterEach, vi, afterAll } from "vitest";
import { initDatabase, getPizza, eraseDB } from "../src/services/database";
import { MenuPizzas } from "../src/configuration";
import { getPendingOrders, listOrders, newOrder, nextStepOrder, rejectOrder } from "../src/services/actions";
import { OrderStatuses, Status } from "../src/models/models";


function createNewOrder(user, pizzas) {
  const order = {
    user: user,
    pizzas: pizzas
  };
  
  const orderDB = newOrder(order);
  return orderDB;
}

describe('pizza restaurant', () => {

  beforeAll(async () => {
    await initDatabase();
  });

  test('load database and seeds', () => {

    const pizzas = [
      MenuPizzas.margherita,
      MenuPizzas.bufalina,
      MenuPizzas.marinara,
      MenuPizzas.cotto,
      MenuPizzas.funghi
    ];

    for ( const pizzaName of pizzas ) {
      const pizza = getPizza(pizzaName);
      expect(pizza).not.toBeNull();
    }

  });


  test('create order', async () => {

    const margherita = getPizza(MenuPizzas.margherita);
    const cotto = getPizza(MenuPizzas.cotto);

    const orderDB = createNewOrder('user-test1', [ margherita, cotto ]);
    
    expect(orderDB).not.toBeNull();

    expect(orderDB.status).toBe( Status.pending );

    expect( orderDB.code ).not.toBeNull();
    expect( orderDB.code ).toHaveLength(4);

  });

  test('cannot create order without user', async () => {

    const margherita = getPizza(MenuPizzas.margherita);
    const cotto = getPizza(MenuPizzas.cotto);

    const order = {
      user: '',
      pizzas: [margherita, cotto]
    };
    
    expect(() => newOrder(order)).toThrowError(/must have a user/)

  });

  test('cannot create order without pizzas', async () => {

    const order = {
      user: 'user-test1',
      pizzas: []
    };
    
    expect(() => newOrder(order)).toThrowError(/must have at least one pizza/)

  });

  test('user-test1 must have at lease one order with 2 pizzas', async () => {

    const margherita = getPizza(MenuPizzas.margherita);
    const cotto = getPizza(MenuPizzas.cotto);
    const orderDB = createNewOrder('user-test1', [ margherita, cotto]);

    const orders = listOrders('user-test1')

    expect(orders.length).toBeGreaterThan(0);

    expect( orderDB.pizzas ).toHaveLength(2);

    expect( orderDB.pizzas[0].name ).toBe( MenuPizzas.margherita);
    expect( orderDB.pizzas[1].name ).toBe( MenuPizzas.cotto);

  });


});


describe('chef at work', () => {
  beforeAll(async () => {
    await initDatabase();
  });


  test('chef received at least one order fron user-test1', async () => {

    const margherita = getPizza(MenuPizzas.margherita);
    const cotto = getPizza(MenuPizzas.cotto);
    createNewOrder('user-test1', [ margherita, cotto]);

    const orders = listOrders('user-test1');

    expect(orders.length).toBeGreaterThan(0);

    const userOrder = orders[orders.length - 1];

    expect( userOrder.user ).toBe('user-test1');
    expect( userOrder.status ).toBe( Status.pending );

  });

  test('chef can move order to next step', async () => {

    const margherita = getPizza(MenuPizzas.margherita);
    const cotto = getPizza(MenuPizzas.cotto);
    createNewOrder('user-test1', [ margherita, cotto]);

    const orders = listOrders();
    const lastOrder = orders[ orders.length - 1];

    expect(lastOrder.status).toBe( Status.pending );

    let newLastOrder = nextStepOrder(lastOrder);

    expect( newLastOrder.pizzas ).toHaveLength(2);

    expect(newLastOrder.status).toBe( Status.progress );

    newLastOrder = nextStepOrder(lastOrder);

    expect(newLastOrder.status).toBe( Status.ready );

  });

  test('chef cannot move order that is already closed', async () => {

    const orders = listOrders();
    const lastOrder = orders[ orders.length - 1];

    expect(lastOrder.status).toBe( Status.ready );

    expect(() => nextStepOrder(lastOrder)).toThrowError(/already delivered/);

  });


  test('chef can reject the order', async () => {

    const bufalina = getPizza(MenuPizzas.bufalina);
    const funghi = getPizza(MenuPizzas.funghi);
    createNewOrder('user-test2', [ bufalina, funghi]);

    const orders = getPendingOrders();
    const lastOrder = orders[ orders.length - 1 ];

    expect(lastOrder.status).toBe( Status.pending );

    rejectOrder(lastOrder);

    expect(lastOrder.status).toBe( Status.rejected );

    expect(lastOrder.pizzas).toHaveLength( 2 );

  });

  test('chef cannot move rejected order', async () => {

    const bufalina = getPizza(MenuPizzas.bufalina);
    const funghi = getPizza(MenuPizzas.funghi);
    createNewOrder('user-test2', [ bufalina, funghi]);

    const orders = getPendingOrders();
    const lastOrder = orders[ orders.length - 1 ];

    const newLastOrder = rejectOrder(lastOrder);

    expect(() => nextStepOrder(newLastOrder)).toThrowError(/it is rejected/)


  });

  test('chef cannot move 2 orders in progress', async () => {

    const bufalina = getPizza(MenuPizzas.bufalina);
    const funghi = getPizza(MenuPizzas.funghi);
    const order1 = createNewOrder('user-test3', [ bufalina, funghi]);

    const order2 = createNewOrder('user-test4', [ bufalina, funghi]);

    const order2DB = nextStepOrder(order1);

    expect(order2DB.status).toBe( Status.progress );

    expect( () => nextStepOrder(order2) ).toThrowError( /Only one order/ );

  });

  afterAll(() => {
    eraseDB();
  })

});