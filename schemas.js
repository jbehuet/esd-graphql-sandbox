const {
    GraphQLID,
    GraphQLBoolean,
    GraphQLString,
    GraphQLList,
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLSchema
} = require("graphql");

let todos = require("./data").todos

const Todo = new GraphQLObjectType({
    name: "Todo",
    fields: {
        id: {
            type: GraphQLID,
            description: "The id of the todo"
        },
        task: {
            type: GraphQLNonNull(GraphQLString),
            description: "The task of the todo"
        },
        completed: {
            type: GraphQLBoolean,
            description: "Whether the todo is completed or not"
        }
    }
});

const TodoInput = new GraphQLInputObjectType({
    name: "TodoInput",
    fields: {
        task: {
            type: GraphQLString,
            description: "The task of the todo"
        },
        completed: {
            type: GraphQLBoolean,
            description: "Whether the todo is completed or not"
        }
    }
});

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        todos: {
            type: new GraphQLList(Todo),
            resolve: (root, args, context, info) => {
                return todos;
            }
        },
        todo: {
            type: Todo,
            args: {
                id: { type: GraphQLID }
            },
            resolve: (root, args, context) => {
                const todo = todos.find(todo => todo.id == args.id);
                return todo;
            }
        }
    },
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createTodo: {
            type: Todo,
            args: {
                input: { type: TodoInput }
            },
            resolve: (root, args, context) => {
                const { input } = args;
                const todo = {
                    id: todos.length,
                    task: input.task || "to be defined",
                    completed: input.completed || false
                };
                todos.push(todo);

                return todo;
            }
        },
        updateTodo: {
            type: Todo,
            args: {
                id: { type: GraphQLID },
                input: { type: TodoInput }
            },
            resolve: (root, args, context) => {
                const { input, id } = args;
                const idx = todos.findIndex(todo => todo.id == id);
                if (input.task) todos[idx].task = input.task;
                todos[idx].completed = input.completed || false;

                return todos[idx];
            }
        },

        deleteTodo: {
            type: Todo,
            args: {
                id: { type: GraphQLID }
            },
            resolve: (root, args, context) => {
                const { id } = args;
                const todo = todos.find(todo => todo.id == id);
                todos = todos.filter(todo => todo.id != id);
                return todo;
            }
        }
    }
});


module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});


// const schema = require('./schema');
// app.use('/graphql', graphqlHTTP({
//     // GraphQL’s data schema
//     schema: schema,
//     // Pretty Print the JSON response
//     pretty: true,
//     // Enable GraphiQL dev tool
//     graphiql: true
// }));