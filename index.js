import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from 'cors';

import { registerValidatoin, loginValidatoin, postCreateValidatoin } from "./validations/validations.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";
import { UserController, PostController } from "./controllers/index.js";

// Подключение к базе данных
mongoose
  .connect('mongodb+srv://admin:draglon750@cluster0.znj5tnf.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => { console.log('DB ok') })
  .catch((err) => { console.log('DB error', err) });

const app = express(); // запуск Express
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname); 
  }
})

const upload = multer({ storage });

app.use(express.json()); // читать JSON в запросах
app.use(cors());
app.use('/uploads', express.static('uploads'));

// POST запрос login
app.post('/auth/login', loginValidatoin, handleValidationErrors, UserController.login)
// POST запрос registration
app.post('/auth/register', registerValidatoin, handleValidationErrors, UserController.register)
// GET запрос на получение информации о пользователе
app.get('/auth/me', checkAuth, UserController.getMe)


// POST загрузка изображения
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  })
});

// Статьи
app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidatoin, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidatoin, handleValidationErrors, PostController.update)

// Запуск сервера
app.listen(4444, (error) => {
  if (error) {
    return console.log(error);
  }

  console.log('Server OK')
});
