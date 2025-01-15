const express = require('express');
const router = express.Router();
const groupController = require('./groupsController');

router.post('/creategroup', groupController.createGroup);
router.get('/', groupController.getAllGroups);
router.get('/:id', groupController.getGroupbyId);
router.put('/:id', groupController.updateGroup);
router.delete('/:id', groupController.deleteGroup);

module.exports = router;



