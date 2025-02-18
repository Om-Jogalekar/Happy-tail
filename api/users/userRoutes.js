const express = require("express");
const userController = require("./userController");
const loginController = require('./login');
const router = express.Router();

router.post("/" ,userController.createUser);
router.get("/" , userController.getAllUser);
router.get("/:id" , userController.getUserById);
router.put("/:id",userController.updateUser);
router.delete("/:id" , userController.deleteUser);
router.post('/login', loginController.login);
module.exports = router;