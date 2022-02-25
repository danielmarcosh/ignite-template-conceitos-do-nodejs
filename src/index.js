const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.body;
  const user = users.find(element => element.username === username);

  if(!user) {
    return response.status(404).send();
  }

  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  users.push({
    id: uuidv4(),
    name: name,
    username: username,
    todos: []
  });

  console.log(users);

  return response.status(201).send();
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;

  const user = users.find(element => element.username === username);

  return response.status(200).json(user.todos).send();
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, done, username } = request.body;
  const user = users.find(element => element.username === username);

  user.todos.push({
    id: uuidv4(),
    title: title,
    done: done,
    deadline: new Date,
    created_at: new Date
  });

  console.log(user);

  return response.status(201).send();
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;