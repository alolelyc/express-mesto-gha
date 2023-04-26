const { ValidationError, DocumentNotFoundError, CastError } = require('mongoose').Error;
const Card = require('../models/card');
const {
  ERR_STATUS_CREATED_201,
  ERR_STATUS_BAD_REQUEST_400,
  ERR_STATUS_NOT_FOUND_404,
  ERR_STATUS_INTERNAL_SERVER_500,
} = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(ERR_STATUS_INTERNAL_SERVER_500).send({ message: `Произошла ошибка: ${err.name} ${err.message}` }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(ERR_STATUS_CREATED_201).send(card))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(ERR_STATUS_BAD_REQUEST_400).send({ message: 'Некорректные данные при создании новой карточки' });
      } else {
        res.status(ERR_STATUS_INTERNAL_SERVER_500).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

module.exports.delCardById = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(ERR_STATUS_NOT_FOUND_404).send({ message: 'По указанному id карточка не найдена' });
      }
      if (err instanceof CastError) {
        res.status(ERR_STATUS_BAD_REQUEST_400).send({ message: 'Id пользователя передан некорректно' });
      } else {
        res.status(ERR_STATUS_INTERNAL_SERVER_500).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(ERR_STATUS_NOT_FOUND_404).send({ message: 'По указанному id карточка не найдена' });
      }
      if (err instanceof CastError) {
        res.status(ERR_STATUS_BAD_REQUEST_400).send({ message: 'Данные для установки likes переданы некорректно' });
      } else {
        res.status(ERR_STATUS_INTERNAL_SERVER_500).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};

module.exports.disLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(ERR_STATUS_NOT_FOUND_404).send({ message: 'По указанному id карточка не найдена' });
      }
      if (err instanceof CastError) {
        res.status(ERR_STATUS_BAD_REQUEST_400).send({ message: 'Данные для установки likes переданы некорректно' });
      } else {
        res.status(ERR_STATUS_INTERNAL_SERVER_500).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
      }
    });
};
