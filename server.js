const express = require("express");

const path = require("path");

const {open} = require("sqlite");

const sqlite3 = require("sqlite3");

const cors = require("cors")

const dbPath = path.join(__dirname,"todos.db");

const app = express();

app.use(express.json());
app.use(cors())

let db = null;

const initializeDbAndServer = async () => {
    try{
        db = await open({
            filename:dbPath,
            driver:sqlite3.Database,
        });
        app.listen(4000, () => {
            console.log("Server running at 4000")
        });

    } catch (e) {
        console.log(`DB Error: ${e.message}`)
        process.exit(1)
    }
}

initializeDbAndServer()

app.get("/todos", async (req,res) => {
   const getTodos = `SELECT * FROM todos;`
   const todos = await db.all(getTodos)
   res.send(todos)
})

app.delete("/todos/:id", async (req,res) => {
    const {id} = req.params;
    const deleteTodos = `DELETE FROM todos WHERE id = ${id};`
    db.run(deleteTodos)
    res.send("Todo deleted")
})


app.post("/todos", async (req,res) => {
    const {title} = req.body
    const todoPostQuery = `INSERT INTO todos ("title") VALUES ('${title}');`
    await db.run(todoPostQuery)
    res.send("Todo Added Sucessfully")
})


