const { ValidationError, DocumentNotFoundError, CastError } = require('mongoose').Error;
const User = require('../models/user');

const {
  ERR_STATUS_CREATED_201,
  ERR_STATUS_BAD_REQUEST_400,
  ERR_STATUS_NOT_FOUND_404,
  ERR_STATUS_INTERNAL_SERVER_500,
} = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(ERR_STATUS_INTERNAL_SERVER_500).send({ message: `Произошла ошибка: ${err.name} ${err.message}` }));
};

module.exports.getUserId = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(ERR_STATUS_NOT_FOUND_404).send({ message: 'По указанному id пользователь  не найден' });
      }
      if (err instanceof CastError) {
        res.status(ERR_STATUS_BAD_REQUEST_400).send({ message: 'Id пользователя передан некорректно' });
      } else {
        res.status(ERR_STATUS_INTERNAL_SERVER_500).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(ERR_STATUS_CREATED_201).send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(ERR_STATUS_BAD_REQUEST_400).send({ message: 'Некорректные данные при создании пользователя' });
      } else {
        res.status(ERR_STATUS_INTERNAL_SERVER_500).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(ERR_STATUS_NOT_FOUND_404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      if (err instanceof CastError) {
        res.status(ERR_STATUS_BAD_REQUEST_400).send({ message: 'Некорректный id пользователя' });
      }
      if (err instanceof ValidationError) {
        res.status(ERR_STATUS_BAD_REQUEST_400).send({ message: 'Некорректные данные при обновлении пользователя' });
      } else {
        res.status(ERR_STATUS_INTERNAL_SERVER_500).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(ERR_STATUS_BAD_REQUEST_400).send({ message: 'Некорректный id пользователя' });
      }
      if (err instanceof ValidationError) {
        res.status(ERR_STATUS_BAD_REQUEST_400).send({ message: 'Некорректные данные при обновлении пользователя' });
      } else {
        res.status(ERR_STATUS_INTERNAL_SERVER_500).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};
