import { useCallback, useEffect, useState } from "react";
import { Order, Pizza } from "./types";


export async function loadPizzaMenu(): Promise<Pizza[]> {
  const res = await fetch(`/pizzas`);
  const json = await res.json();

  return json;
}


export function usePizzas() {
  const [ pizzas, setPizzas ] = useState<Pizza[]>([]);

  useEffect(() => {
    async function load() {
      const list = await loadPizzaMenu();
      setPizzas( list );
    }
    load();
  }, []);

  return pizzas;
}

export async function loadOrders(user?: string): Promise<Order[]> {
  let url = `/chef/orders`;

  if (user) {
    url = `/users/${user}/orders`;
  }

  const res = await fetch(url);
  const json = await res.json();

  return json;
  
}

export async function submitNewOrder(user: string, pizzas: string[]): Promise<Order> {

  const res = await fetch(`/users/${user}/orders`, {
    method: 'POST', 
    body: JSON.stringify({pizzas}),
    headers: {
      'content-type': 'application/json'
    }
  });
  if ( res.status >= 200 && res.status < 300) {
    const order = await res.json();
    return order;
  }

  throw new Error( await res.text() );
}