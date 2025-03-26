require("dotenv").config();
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const sequelize = require('./config/dbSquelize');
const bodyParser = require("body-parser");

const userRoutes = require("./api/users/userRoutes");
const postRoutes = require('./api/Posts/postRoute');
const groupRoutes = require("./api/Groups/groupsRotues")
const groupMember = require("./api/GroupsMember/groupmembersRoutes");
const product = require("./api/Product/productRoutes");
const order = require('./api/Orders/ordersRoutes');
const orderItems = require('./api/Order Items/OrderItemsRoutes');
const chatRoutes = require('./api/Chatsystem/ChatRoutes');

const authInterceptor = require("./services/authInterceptor");

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // For JSON data
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(authInterceptor);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/groups", groupRoutes);
app.use('/groupmember', groupMember);
app.use('/product', product);
app.use('/order', order);
app.use('/orderitems', orderItems);
app.use('/chat', chatRoutes);

sequelize.sync({ alter: false, force: false }).then(() => {
    console.log("Database connected successfully");
}).catch((err) => {
    console.error('Database connection failed:', err);
});

app.listen(process.env.API_PORT, () => {
    console.log("Server is running on port : ", process.env.API_PORT);
})