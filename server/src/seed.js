// Fictional sample restaurants. Menu items: [name, description, category, price in cents].
const RESTAURANTS = [
  {
    name: 'Casse-Croûte Saint-Denis', cuisine: 'Québécois', opens_at: '11:00', closes_at: '22:00',
    menu: [
      ['Classic Poutine', 'Fries, cheese curds, brown gravy', 'Mains', 1150],
      ['Smoked Meat Sandwich', 'On rye with mustard', 'Mains', 1475],
      ['Pea Soup', 'Traditional yellow pea soup', 'Sides', 650],
      ['Sugar Pie', 'Tarte au sucre', 'Desserts', 595],
    ],
  },
  {
    name: 'Little Saigon Kitchen', cuisine: 'Vietnamese', opens_at: '10:30', closes_at: '21:00',
    menu: [
      ['Beef Pho', 'Rice noodles, rare beef, herbs', 'Mains', 1395],
      ['Lemongrass Chicken Banh Mi', 'Pickled vegetables, cilantro', 'Mains', 995],
      ['Spring Rolls (2)', 'Shrimp, vermicelli, peanut sauce', 'Sides', 725],
      ['Vietnamese Iced Coffee', 'With condensed milk', 'Drinks', 495],
    ],
  },
  {
    name: 'Green Bowl', cuisine: 'Vegetarian', opens_at: '07:30', closes_at: '15:00',
    menu: [
      ['Falafel Bowl', 'Quinoa, hummus, pickled onions', 'Mains', 1395],
      ['Tofu Poke Bowl', 'Rice, edamame, sesame', 'Mains', 1450],
      ['Lentil Soup', 'With lemon and cumin', 'Sides', 600],
      ['Fresh Lemonade', 'Made to order', 'Drinks', 450],
    ],
  },
];

export function seed(db) {
  const addRestaurant = db.prepare(
    'INSERT INTO restaurants (name, cuisine, opens_at, closes_at) VALUES (?, ?, ?, ?)'
  );
  const addItem = db.prepare(
    'INSERT INTO menu_items (restaurant_id, name, description, category, price_cents) VALUES (?, ?, ?, ?, ?)'
  );
  for (const r of RESTAURANTS) {
    const { lastInsertRowid } = addRestaurant.run(r.name, r.cuisine, r.opens_at, r.closes_at);
    for (const [name, description, category, price] of r.menu) {
      addItem.run(lastInsertRowid, name, description, category, price);
    }
  }
}
