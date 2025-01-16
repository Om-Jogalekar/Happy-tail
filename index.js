require("dotenv").config();
const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require("./api/users/userRoutes");
const postRoutes = require('./api/Posts/postRoute');
const groupRoutes = require("./api/Groups/groupsRotues")
const groupMember = require("./api/GroupsMember/groupmembersRoutes");
const product = require("./api/Product/productRoutes");
const order = require('./api/Orders/ordersRoutes');
const orderItems = require('./api/Order Items/OrderItemsRoutes');
const sequelize = require('./config/dbSquelize');
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());

app.use("/users", userRoutes);
app.use("/posts" , postRoutes);
app.use("/groups" , groupRoutes);
app.use('/groupmember' , groupMember);
app.use('/product' , product);
app.use('/order' , order);
app.use('/orderitems' , orderItems);

sequelize.sync({alter:false , force:false}).then(() => {
    console.log("Database connected successfully");
}).catch((err) => {
    console.error('Database connection failed:', err);
});

app.listen(process.env.API_PORT , ()=>{
    console.log("Server is running on port : ", process.env.API_PORT);
})