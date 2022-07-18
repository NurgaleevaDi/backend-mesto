const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const NotFoundError = require('./errors/not-found-error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { cors } = require('./middlewares/cors');

// console.log('env ', process.env.NODE_ENV);

const app = express();
const { PORT = 3000 } = process.env;
// const PORT = 3000;
const {
  createUser,
  login,
} = require('./controllers/users');
const { auth } = require('./middlewares/auth');

app.use(cors);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger); // подключаем логгер запросов до всех обработчиков роутов

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

// краш-тест сервера
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(/^https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-._~:/?#[\]@!$&'()*+,;=]{2,}#?$/),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);
app.use('/*', auth, (req, res, next) => next(new NotFoundError('Запрашиваемая страница не существует')));

app.use(errorLogger); // подключаем логгер ошибок после обработчиков роутов и до обработчиков ошибок

app.use(errors());
// централизованная обработка ошибок
/* eslint-disable-next-line */
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('App started and listen port', PORT);
});
