const http = require("http");
const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require('express-graphql');


/** Init app */
const app = express();

/** CORS */
app.use(cors());
/** Parse the request */
app.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
app.use(express.json());

/** DATA */
let todos = require("./data").todos


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

/** GRAPHQL API */

var { buildSchema } = require('graphql')

var schema = buildSchema(`
    type Todo {
        id: Int
        task: String
        completed: Boolean
    }

    type Query {
        todos: [Todo]
        todo(id:Int): Todo
    }

    type Mutation {
        createTodo(task:String completed:Boolean): Todo
        updateTodo(id:Int task:String completed:Boolean): Todo
        deleteTodo(id:Int): Todo
    } 
    
    `)

var resolvers = {
    todos: () => {
        return todos;
    },
    todo: (args) => {
        const todo = todos.find(todo => todo.id == args.id);
        return todo;
    },
    createTodo: (args) => {
        const todo = {
            id: todos.length,
            task: args.task || "to be defined",
            completed: args.completed || false
        };
        todos.push(todo);
        return todo
    },
    updateTodo: (args) => {
        const idx = todos.findIndex(todo => todo.id == args.id);
        if (args.task) todos[idx].task = args.task;
        todos[idx].completed = args.completed || false;

        return todos[idx];
    },
    deleteTodo: (args) => {
        const todo = todos.find(todo => todo.id == args.id);
        todos = todos.filter(todo => todo.id != args.id);
        return todo;
    }
}

app.use("/graphql", graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true
}));


/** Server */
const httpServer = http.createServer(app);
const PORT = process.env.PORT ?? 6060;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));