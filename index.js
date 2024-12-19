import express from "express";
import mongoose from "mongoose";

import { registerValidatoin, loginValidatoin, postCreateValidatoin } from "./validations/validations.js";
import checkAuth from "./utils/checkAuth.js";

import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";

// Подключение к базе данных
mongoose
  .connect('mongodb+srv://admin:draglon750@cluster0.znj5tnf.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => { console.log('DB ok') })
  .catch((err) => { console.log('DB error', err) });

const app = express(); // запуск Express

app.use(express.json()); // читать JSON в запросах

// POST запрос login
app.post('/auth/login', loginValidatoin, UserController.login)
// POST запрос registration
app.post('/auth/register', registerValidatoin, UserController.register)
// GET запрос на получение информации о пользователе
app.get('/auth/me', checkAuth, UserController.getMe)

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidatoin, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, PostController.update)

// Запуск сервера
app.listen(4444, (error) => {
  if (error) {
    return console.log(error);
  }

  console.log('Server OK')
});
