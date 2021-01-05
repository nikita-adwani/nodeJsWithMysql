const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = process.env.Port || 5000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//mysql
const pool = mysql.createPool({
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'taskdatabase'
    })
    // get task
app.get('', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connection as a id ${connection.threadId}`);

        connection.query('SELECT * from task', (err, row) => {
            connection.release(); //return connection to the pool
            if (!err) {
                res.send(row)
            } else {
                console.log(err);
            }
        })
    })
})

// get task by id
app.get('/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connection as a id ${connection.threadId}`);

        connection.query('SELECT * from task where id =?', [req.params.id], (err, row) => {
            connection.release(); //return connection to the pool
            if (!err) {
                res.send(row)
            } else {
                console.log(err);
            }
        })
    })
})

//delete task
app.delete('/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connection as a id ${connection.threadId}`);

        connection.query('DELETE from task where id =?', [req.params.id], (err, row) => {
            connection.release(); //return connection to the pool
            if (!err) {
                res.send(`Task with id: ${[req.params.id]} deleted from task list!!`)
            } else {
                console.log(err);
            }
        })
    })
})

//add task
app.post('', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connection as a id ${connection.threadId}`);
        const params = req.body;
        connection.query('INSERT INTO task SET?', params, (err, row) => {
            connection.release(); //return connection to the pool
            if (!err) {
                res.send(`Task added with name: ${params.task_name}`)
            } else {
                console.log(err);
            }
        })
    })
})

//update the task
app.put('', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connection as a id ${connection.threadId}`);
        const { id, task_name, task_done } = req.body;
        connection.query('UPDATE task SET task_name =? WHERE id=?', [task_name, id], (err, rows) => {
            connection.release(); //return connection to the pool
            if (!err) {
                res.send(`The task name updated to ${task_name}`);
            } else {
                console.log(err);
            }
        })
        console.log(req.body)
    })
})



app.listen(port, () => console.log(`The sever is listening to port ${port}`));