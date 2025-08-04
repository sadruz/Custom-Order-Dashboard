const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Get all orders for a customer
router.get('/customer/:customerId', orderController.getCustomerOrders);

// Get order details
router.get('/:orderId', orderController.getOrderDetails);

module.exports = router;