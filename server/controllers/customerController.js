const db = require('../config/db');

// Get all customers with pagination
exports.getAllCustomers = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const sql = `SELECT * FROM users LIMIT ? OFFSET ?`;
  
  db.all(sql, [limit, offset], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

// Get customer details with order count
exports.getCustomerById = (req, res) => {
  const customerId = req.params.id;

  // Get customer details
  db.get(
    `SELECT * FROM users WHERE id = ?`,
    [customerId],
    (err, customer) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      // Get order count
      db.get(
        `SELECT COUNT(*) as orderCount FROM orders WHERE user_id = ?`,
        [customerId],
        (err, countResult) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          res.json({
            ...customer,
            orderCount: countResult.orderCount
          });
        }
      );
    }
  );
};