const db = require('../config/db');

// Get all orders for a specific customer
exports.getCustomerOrders = (req, res) => {
  const customerId = req.params.customerId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // First verify customer exists
  db.get(
    'SELECT id FROM users WHERE id = ?',
    [customerId],
    (err, customer) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      // Get paginated orders
      db.all(
        `SELECT * FROM orders 
         WHERE user_id = ? 
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`,
        [customerId, limit, offset],
        (err, orders) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to fetch orders' });
          }

          // Get total count for pagination metadata
          db.get(
            'SELECT COUNT(*) as total FROM orders WHERE user_id = ?',
            [customerId],
            (err, countResult) => {
              if (err) {
                return res.status(500).json({ error: 'Failed to count orders' });
              }

              res.json({
                data: orders,
                pagination: {
                  total: countResult.total,
                  page,
                  limit,
                  totalPages: Math.ceil(countResult.total / limit)
                }
              });
            }
          );
        }
      );
    }
  );
};

// Get specific order details
exports.getOrderDetails = (req, res) => {
  const orderId = req.params.orderId;

  // Get order header
  db.get(
    'SELECT * FROM orders WHERE order_id = ?',
    [orderId],
    (err, order) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Get order items
      db.all(
        `SELECT oi.*, p.name as product_name, p.retail_price 
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [orderId],
        (err, items) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to fetch order items' });
          }

          res.json({
            ...order,
            items: items || [],
            itemCount: items ? items.length : 0
          });
        }
      );
    }
  );
};