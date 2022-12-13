const todoRepository = require('./todo.repository');

const todoService = {
    _getTodoList: () => {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(await todoRepository.get());
            } catch(error) {
                console.log("_getTodoList Error", error);
                reject(error);
            }
        })
    },

    _addItemTodoList: (itemData) => {
        return new Promise(async (resolve, reject) => {
            try {
                if(!itemData.task) throw "Task value to add is required"; 
                resolve(await todoRepository.add(itemData));
            } catch(error) {
                console.log("_addItemTodoList Error", error);
                reject(error);
            }
        })
    },

    _updateTodoItem: (itemData) => {
        return new Promise(async (resolve, reject) => {
            try {
                const errorList = [];
                if(!itemData.id) errorList.push("ID to update is required");
                if(!itemData.task && itemData.completed == null) {
                    errorList.push("Either task or completed field is required");
                }
                if(errorList.length > 0) throw errorList;
                if(itemData.listOrder) itemData.listOrder = null;
                resolve(await todoRepository.update(itemData));
            } catch(error) {
                console.log("_updateTodoItem Error", error);
                reject(error);
            }
        })
    },

    _updateItemOrder: ({id, listOrder}) => {
        return new Promise(async (resolve, reject) => {
            try {
                const errorList = [];
                if(!id) errorList.push("ID to update is required");
                if(!listOrder) errorList.push("List Order is required");
                if(errorList.length > 0) throw errorList;

                //used as current data reference
                const currentItemData = await todoRepository.getById(id);

                //identifies if item will be oved up or pushed down
                //query to move the rest of the items up or down
                let updateListOrderQuery = '';
                if(listOrder > currentItemData.listorder) {
                    updateListOrderQuery = `
                        UPDATE to_do
                        SET listorder = (listorder - 1)
                        WHERE listorder > ${currentItemData.listorder}
                        AND listorder <= ${listOrder}
                    `
                } else {
                    updateListOrderQuery = `
                        UPDATE to_do
                        SET listorder = (listorder + 1)
                        WHERE listorder < ${currentItemData.listorder}
                        AND listorder >= ${listOrder};
                    `
                }
                await todoRepository.query(updateListOrderQuery);
                
                
                resolve(await todoRepository.update({id, listOrder}));
            } catch(error) {
                console.log("_updateItemOrder Error", error);
                reject(error)
            }
        })
    },

    _removeTodoItem: ({id}) => {
        return new Promise(async (resolve, reject) => {
            try {
                if(!id) throw "ID is required to delete"; 

                //updates the order to adjust to adjust other item order
                await todoRepository.query(`
                    UPDATE to_do
                    SET listorder = (listorder - 1)
                    WHERE listorder > (
                        SELECT listorder FROM to_do
                        WHERE id = ${id}
                    );
                `);

                resolve(await todoRepository.delete(id));
            } catch(error) {
                console.log("_removeTodoItem Error", error);
                reject(error);
            }
        })
    }
}

module.exports = todoService;