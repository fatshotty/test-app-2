import Realm from 'realm';
import Path from 'path';
import { Pizza, Order } from '../models/models.js';
import { MenuPizzas, ROOT_FOLDER } from '../configuration.js';

let DB = null;

export async function initDatabase() {
  DB = await Realm.open({
    path: Path.join(ROOT_FOLDER, `${process.env.NODE_ENV === 'test' ? 'tests' : 'data'}/database.realm`),
    schema: [ Pizza.schema, Order.schema ],
    schemaVersion: 1
  });

  seeds();
}

export function closeDatabase() {
  DB.closeDatabase();
}

export function eraseDB() {
  DB.write(() => {
    // Delete all objects from the realm.
    DB.deleteAll();
  });
}

export function getPizza(name) {
  const pizza = DB.objectForPrimaryKey(Pizza.schema.name, name );
  return pizza;
}

function seeds() {

  function checkExists(name) {
    const pizza = getPizza(name);
    return !!pizza;
  }

  write(() => {

    if ( ! checkExists(MenuPizzas.margherita) ) {
      DB.create(Pizza.schema.name, {
        name: MenuPizzas.margherita,
        ingredients: [ 'pomodoro', 'mozzarella', 'origano' ]
      });
    }

    if ( ! checkExists(MenuPizzas.bufalina) ) {
      DB.create(Pizza.schema.name, {
        name: MenuPizzas.bufalina,
        ingredients: [ 'pomodoro', 'mozzarella di bufala', 'origano' ]
      });
    }

    if ( ! checkExists(MenuPizzas.marinara) ) {
      DB.create(Pizza.schema.name, {
        name: MenuPizzas.marinara,
        ingredients: [ 'pomodoro', 'aglio', 'olio', 'origano' ]
      });
    }

    if ( ! checkExists(MenuPizzas.cotto) ) {
      DB.create(Pizza.schema.name, {
        name: MenuPizzas.cotto,
        ingredients: [ 'pomodoro', 'mozzarella', 'prosciutto cotto' ]
      });
    }

    if ( ! checkExists(MenuPizzas.funghi) ) {
      DB.create(Pizza.schema.name, {
        name: MenuPizzas.funghi,
        ingredients: [ 'pomodoro', 'mozzarella', 'funghi' ]
      });
    }
  })
}

export function getPizzas() {
  return DB.objects(Pizza.schema.name);
}


export function getOrders(user) {

  let ordersDB = DB.objects(Order.schema.name);

  if (user) {
    ordersDB = ordersDB.filtered('user == $0', user);
  }

  return ordersDB;
}

export function getOrderByStatus(status, user) {
  const ordersDB = getOrders(user);

  return ordersDB.filtered('status == $0', status);
}

export function getOrder(id) {
  return DB.objectForPrimaryKey( Order.schema.name, id);
}

export function createOrModifyOrder(order) {
  return write(() => {
    const orderToSave = JSON.parse(JSON.stringify(order) );
    return DB.create( Order.schema.name, orderToSave, Realm.UpdateMode.Modified );
  });
}

let TRANS_OPENED = false
export function write(fn) {
  if ( TRANS_OPENED ) {
    return fn();
  } else {
    try {
      TRANS_OPENED = true;
      return DB.write(() => {
        return fn();
      });
    } catch(e) {
      console.error(e);
    } finally {
      TRANS_OPENED = false
    }
  }
  
}
