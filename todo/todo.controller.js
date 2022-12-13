const todoService = require('./todo.service');

const todoController = {
    getTodoList: (req, res, next) => {
        todoService._getTodoList()
            .then(result => {
                res.json(result);
            })
            .catch(error => {
                console.log("getTodoList Error", error);
                next(error);
            })
    },

    addItemTodoList: (req, res, next) => {
        todoService._addItemTodoList(req.body)
            .then(result => {
                res.json(result);
            })
            .catch(error => {
                console.log("addItemTodoList Error", error);
                next(error);
            })
    },

    updateTodoItem: (req, res, next) => {
        todoService._updateTodoItem(req.body)
            .then(result => {
                res.json(result);
            })
            .catch(error => {
                console.log("updateTodoItem Error", error);
                next(error);
            })
    },

    updateItemOrder: (req, res, next) => {
        todoService._updateItemOrder(req.body)
            .then(result => {
                res.json(result);
            })
            .catch(error => {
                console.log("updateItemOrder Error", error);
                next(error);
            })
    },

    removeTodoItem: (req, res, next) => {
        todoService._removeTodoItem(req.query)
            .then(result => {
                res.status(202).json(result);
            })
            .catch(error => {
                console.log("removeTodoItem Error", error);
                next(error);
            })
    },
}

module.exports = todoController;