import { createContext, useContext, useState } from 'react';

const OrderContext = createContext(null);

const emptyOrder = { restaurant_id: null, items: [] };

export function OrderProvider({ children }) {
  const [order, setOrder] = useState(emptyOrder);

  function addItem(restaurantId, menuItem) {
    setOrder((current) => {
      const items = current.restaurant_id === restaurantId ? current.items : [];
      const existing = items.find((item) => item.menu_item_id === menuItem.id);

      if (existing) {
        return {
          restaurant_id: restaurantId,
          items: items.map((item) =>
            item.menu_item_id === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }

      const newItem = {
        menu_item_id: menuItem.id,
        name: menuItem.name,
        price_cents: menuItem.price_cents,
        quantity: 1,
      };
      return { restaurant_id: restaurantId, items: [...items, newItem] };
    });
  }

  function setQuantity(menuItemId, quantity) {
    setOrder((current) => ({
      ...current,
      items: current.items
        .map((item) => (item.menu_item_id === menuItemId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0),
    }));
  }

  function removeItem(menuItemId) {
    setQuantity(menuItemId, 0);
  }

  function clear() {
    setOrder(emptyOrder);
  }

  return (
    <OrderContext.Provider value={{ order, addItem, removeItem, setQuantity, clear }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  return useContext(OrderContext);
}
