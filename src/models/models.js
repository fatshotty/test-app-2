import Realm from 'realm';

export const Status = {
  rejected: 'rejected',
  pending: 'pending',
  progress: 'progress',
  ready: 'ready'
}

export const OrderStatuses = [ Status.rejected, Status.pending, Status.progress, Status.ready ];

function generateCode() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

export class Pizza extends Realm.Object {
  static schema = {
    name: 'pizza',
    properties: {
      name: {type: 'string', indexed: true },
      ingredients: 'string[]'
    },
    primaryKey: 'name'
  }
}

export class Order extends Realm.Object {
  static schema = {
    name: 'order',
    properties: {
      _id: { type: "string", default: () => new Realm.BSON.ObjectId().toString() },
      user: 'string',
      code: { type: 'string', default: () => generateCode() },
      pizzas: 'pizza[]',
      status: { type: "string", default: () => OrderStatuses[1] },
      time: 'int'
    },
    primaryKey: '_id'
  }
}