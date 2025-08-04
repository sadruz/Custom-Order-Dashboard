const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./ecommerce.db');

// 1. Check if customer 17 exists
db.get("SELECT id, first_name, email FROM users WHERE id = 17", (err, customer) => {
  console.log('\n1. Customer Verification:');
  console.log(customer || '❌ Customer not found');

  // 2. Check their orders
  db.all("SELECT order_id, status FROM orders WHERE user_id = 17", (err, orders) => {
    console.log('\n2. Orders Verification:');
    console.log(orders.length > 0 ? orders : '❌ No orders found');

    // 3. Check random customer with orders (for testing)
    db.get(`
      SELECT u.id, u.first_name, COUNT(o.order_id) as order_count 
      FROM users u
      JOIN orders o ON u.id = o.user_id
      GROUP BY u.id
      LIMIT 1
    `, (err, sample) => {
      console.log('\n3. Sample Customer With Orders:');
      console.log(sample || '❌ No customers with orders found');
    });
  });
});

db.all(`
  SELECT 
    o.order_id, 
    o.status, 
    o.created_at,
    o.num_of_item,
    COUNT(oi.id) as item_count
  FROM orders o
  LEFT JOIN order_items oi ON o.order_id = oi.order_id
  WHERE o.user_id = 17
  GROUP BY o.order_id
`, (err, orders) => {
  console.log('Orders for Anthony (ID 17):');
  console.log(orders.length > 0 ? orders : 'No orders found');
  db.close();
});