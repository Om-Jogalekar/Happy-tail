const express = require('express');
const router = express.Router();
const orderController = require('./ordersController');


router.post('/addorder',orderController.createOrder);
router.get('/',orderController.getAllOrders);
router.get('/user/:id' , orderController.getAllOrderByUserId);
router.get('/:id' , orderController.getOrderById);
router.put('/:id' , orderController.updateOrder);
router.delete('/:id' , orderController.deleteOrder);

module.exports=router;