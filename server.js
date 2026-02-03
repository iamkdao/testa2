const express = require("express")
const path = require("path")

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

let nextId = 1
let todos = [
]
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
})

app.get("/add", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "add.html"));
})

app.get("/api/data", (req, res) => {
    res.json(todos);
})

app.post("/api/data", (req, res) => {
    console.log(req.body);
    const deadline = new Date(req.body.deadline);
    const diffMs = deadline - new Date(req.body.date);
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    console.log(diffDays)

    const todo = {
        id: nextId++,
        task: req.body.task,
        desc: req.body.desc,
        priority: req.body.priority,
        deadline: diffDays,
        date: req.body.date
    }

    // example: add new item
    todos.push(todo);

    res.status(200).send("OK");
})

app.delete(`/api/data/:id`, (req, res) => {
    const todoId = parseInt(req.params.id)

    const index = todos.findIndex(todo => todo.id == todoId)

    if (index !== -1) {
        todos.splice(index, 1)
        res.sendStatus(204)
    } else {
        res.status(404).json({ error: `Todo with ${todoId} not found` })
    }
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
});