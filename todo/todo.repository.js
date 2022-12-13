const { Client } = require('pg');

const client = new Client({
    host: process.env.DB_HOST,
    database: process.env.DB_USER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

client.connect();

const todoRepository = {
    get: async() => {
        return new Promise((resolve, reject) => {
            client.query('SELECT * FROM to_do ORDER BY listorder;', (err, res) => {
                if(!err) resolve(res.rows);
                else reject(err.message);
            });
        })
    },

    getById: async(id) => {
        return new Promise((resolve, reject) => {
            client.query(`SELECT * FROM to_do WHERE id = ${id}`, (err, res) => {
                if(!err) resolve(res.rows[0]);
                else reject(err.message);
            });
        })
    },

    add: async({task}) => {
        return new Promise((resolve, reject) => {
            client.query(
                `INSERT INTO to_do 
                (task, completed, listorder) 
                VALUES ('${task}', false, ((SELECT COUNT(*) FROM to_do) + 1))
                RETURNING id, task, completed, listorder;`, 
                (err, res) => {
                    if(!err, res) resolve(res.rows[0]);
                    else reject(err.message);
                });
        })
    },

    update: async(itemData) => {
        const dataString = formatDataString(itemData);
        return new Promise((resolve, reject) => {
            client.query(
                `UPDATE to_do
                SET ${dataString}
                WHERE id = ${itemData.id}
                RETURNING id, task, completed, listorder;`, 
                (err, res) => {
                    if(!err, res) resolve(res.rows[0]);
                    else reject(err.message);
                });
        })
    },

    delete: async(id) => {
        return new Promise((resolve, reject) => {
            client.query(
                `DELETE FROM to_do
                WHERE id = ${id}
                RETURNING id;`, 
                (err, res) => {
                    if(!err, res) resolve(res.rows[0]);
                    else reject(err.message);
                });
        })
    },

    query: async(queryString) => {
        return new Promise((resolve, reject) => {
            client.query(queryString, 
                (err, res) => {
                    if(!err, res) resolve(res.rows);
                    else reject(err.message);
                });
        })
    },

}

//conversts object to query usable string
formatDataString = (itemData) => {
    let updateData = {};
    if(itemData.task) updateData.task = itemData.task;
    if(itemData.completed != null) updateData.completed = itemData.completed;
    if(itemData.listOrder) updateData.listOrder = itemData.listOrder;
    return Object.keys(updateData).map((key) => {
        let dataString = `${key} = `;
        if(typeof updateData[key] == 'string') dataString+=`'${updateData[key]}'`;
        else dataString+=`${updateData[key]}`;
        return dataString;
    }).join(",");
}

module.exports = todoRepository;