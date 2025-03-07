
export enum Statuses {
  pending = 'pending',
  progress = 'progress',
  ready = 'ready',
  rejected = 'rejected'
}

export type Pizza = {
  name: string;
  ingredients: string[];
}

export type Order = {
  _id: string;
  user: string;
  code: string;
  pizzas: Pizza[];
  status: Statuses;
  time: number
}