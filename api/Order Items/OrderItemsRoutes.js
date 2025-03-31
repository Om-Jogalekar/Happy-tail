const express = require('express');
const router = express.Router();
const OrderItemsController = require('./OrderItemsController');

router.post('/addorderitem' , OrderItemsController.createOrderItems);
router.get('/',OrderItemsController.getAllOrderItems);
router.get('/order/:id',OrderItemsController.getOrderItemByOrderId);
router.get('/:id',OrderItemsController.getOrderItemById);
router.put('/:id',OrderItemsController.updateOrderItem);
router.delete('/:id',OrderItemsController.deleteOrderItem);

module.exports = router;