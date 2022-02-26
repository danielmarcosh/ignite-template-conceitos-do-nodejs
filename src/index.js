const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.body;
  const user = users.find((element) => element.username === username);

  if (!user) {
    return response.status(400).json({ error: "O usuário não existe" }).send();
  }

  return next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const verifyIfExistsUsername = users.some(
    (user) => user.username === username
  );

  if (verifyIfExistsUsername) {
    return response.status(400).json({ error: "Usuário já existe" });
  }

  const user = {
    id: uuidv4(),
    name: name,
    username: username,
    todos: [],
  };

  users.push(user);

  return response.status(201).json(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;

  const u = users.find((element) => element.user === user);

  return response.status(200).json(u.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;

  const { title, deadline } = request.body;

  const u = users.find((element) => element.user === user);
  const todo = {
    id: uuidv4(),
    title: title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };
  u.todos.push(todo);

  return response.status(201).json(todo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const { title, deadline } = request.body;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "Todo não existe" });
  }

  todo.title = title || todo.title;
  todo.deadline = deadline ? new Date(deadline) : todo.deadline;

  return response.status(200).json(todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "Todo não existe" });
  }

  todo.done = true;

  return response.status(200).json(todo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "Todo não existe" });
  }

  user.todos.splice(todo, 1);

  return response.status(204).send();
});

module.exports = app;
