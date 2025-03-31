const Order = require("./ordersModel");
const Joi = require("joi");
const { Sequelize } = require('sequelize');
const User = require("../users/userServices");
const Order_Item = require("../Order Items/OrderItemsModel");

const orderSchema = Joi.object({
  buyer_id: Joi.number().required(),
  order_total: Joi.number().min(0).required(),
  status: Joi.string().valid("pending", "completed", "cancelled").optional(),

});

exports.createOrder = async (req, res) => {
  const { error, value } = orderSchema.validate(req.body);

  if (error) return res.status(500).json({ error: error.details[0].message });

  const userExist = await User.findByPk(value.buyer_id);
  if (!userExist)
    return res
      .status(404)
      .json({ message: "Invalid buyer id, Buyer does not exist" });
  try {
    const order = await Order.create(value);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: "buyer",
          attributes: ["id", "username", "email"],
        },
      ],
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: 'buyer',
          attributes: ['id', 'username', 'email']
        },
        {
          model: Order_Item,
          as: 'orderItems',
          required: true, // Ensures only orders with items are fetched
          attributes: ['id', 'product_id', 'quantity', 'price'],
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: 'Invalid Order or No Items Found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOrderByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    const orders = await Order.findAll({
      where: {
        buyer_id: id,
        id: {
          [Sequelize.Op.in]: Sequelize.literal(`(
            SELECT DISTINCT order_id FROM order_items
          )`)
        }
      },
      include: [
        {
          model: User,
          as: 'buyer',
          attributes: ['id', 'username', 'email']
        }
      ]
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders with items found for this user' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'An error occurred while fetching the orders.' });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) return res(404).json({ error: "No such Order found" });

    const { status } = req.body;
    await order.update({ status });
    res.status(200).json(order);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ error: "No such order found" });

    await order.destroy(order);
    res.status(200).json({ message: "Order Deleted Successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
