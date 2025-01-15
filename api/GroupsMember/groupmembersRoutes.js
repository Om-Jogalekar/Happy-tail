const express = require("express");
const router = express.Router();
const grouMemberCotoller = require("./groupMemebersController");
const { route } = require("../users/userRoutes");

router.post('/add' , grouMemberCotoller.addGroupMember);
router.get('/',grouMemberCotoller.getAllGroupMembers);
router.get('/:id' , grouMemberCotoller.getGroupMemberById);
router.put('/:id' , grouMemberCotoller.updateGroupMember);
router.delete('/:id',grouMemberCotoller.deleteGroupMemeber);

module.exports = router;