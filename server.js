const http = require("http");
const express = require("express");
const cors = require("cors");

/** Init app */
const app = express();

/** CORS */
app.use(cors());
/** Parse the request */
app.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
app.use(express.json());

/** DATA */
let todos = [
    {
        id: 0,
        task: "Faire les courses",
        completed: false
    }
];


/** REST API */
app.get("/todos", (req, res) => {
    res.send(todos);
});

app.get("/todos/:id", (req, res) => {
    const todo = todos.find(todo => todo.id == req.params.id);
    if (!todo) res.sendStatus(404);
    res.send(todo);
});

app.post("/todos", (req, res) => {
    todos.push({
        id: todos.length,
        task: req.body.task,
        completed: false
    });
    res.sendStatus(201);
});

app.put("/todos/:id", (req, res) => {
    const idx = todos.findIndex(todo => todo.id == req.params.id);
    todos[idx] = req.body;
    res.sendStatus(200);
});


app.delete("/todos/:id", (req, res) => {
    todos = todos.filter(todo => todo.id != req.params.id);
    res.sendStatus(200);
});

/** Server */
const httpServer = http.createServer(app);
const PORT = process.env.PORT ?? 6060;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));