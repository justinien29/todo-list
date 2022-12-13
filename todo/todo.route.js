const express = require('express'),
    router = express.Router(),
    todoController = require('./todo.controller');

router.get('/getList', todoController.getTodoList);
router.post('/addToList', todoController.addItemTodoList);
router.put('/updateTaskItem', todoController.updateTodoItem);
router.put('/updateItemOrder', todoController.updateItemOrder);
router.delete('/removeTaskItem', todoController.removeTodoItem);

module.exports = router;