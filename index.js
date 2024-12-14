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

// post запрос
app.post('/auth/register', registerValidatoin, async (req, res) => {
  try {
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

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      }
    );

    res.json({ ...user, token })
  }
  catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    });
  }
})

// Запуск сервера
app.listen(4444, (error) => {
  if (error) {
    return console.log(error);
  }

  console.log('Server OK')
});
