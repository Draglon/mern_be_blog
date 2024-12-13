import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

import { registerValidatoin } from "./validations/auth.js";
import UserModel from "./models/User.js";

// Подключение к базе данных
mongoose
  .connect('mongodb+srv://admin:draglon750@cluster0.znj5tnf.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => { console.log('DB ok') })
  .catch((err) => { console.log('DB error', err) });

const app = express(); // запуск Express

app.use(express.json()); // читать JSON в запросах

// GET запрос
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// });

// POST запрос
// app.post('/auth/login', (req, res) => {
//   console.log(req.body)

//   // Создать jwt токен
//   const token = jwt.sign({
//     email: req.body.email,
//     fullName: req.body.fullName,

//   }, 'secretKey')

//   res.json({
//     success: true,
//     token,
//   })
// })

app.post('/auth/register', registerValidatoin, async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array())
  }

  const password = req.body.password;
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const doc = new UserModel({
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl,
    passwordHash,
  })

  const user = await doc.save();

  res.json(user)
})

// Запуск сервера
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK')
});
