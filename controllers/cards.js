const { ValidationError, DocumentNotFoundError, CastError } = require('mongoose').Error;
const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequest400');
const NotFoundError = require('../errors/NotFoundError404');
const ForbiddenError = require('../errors/ForbiddenError403');

const {
  ERR_STATUS_CREATED_201,

} = require('../utils/constants');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => card.populate('owner'))
    .then((card) => res.status(ERR_STATUS_CREATED_201).send(card))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError('Некорректные данные при создании новой карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.delCardById = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findById(cardId)
    .then((card) => {
      if (card.owner.toString() !== _id) {
        next(new ForbiddenError('У Вас отстутствуют права на удаление этой карточки'));
      } else {
        Card.findByIdAndRemove(cardId)
          .then(() => res.send(card));
      }
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError('По указанному id карточка не найдена'));
        return;
      }
      if (err instanceof CastError) {
        next(new BadRequestError('Id пользователя передан некорректно'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('По указанному id карточка не найдена');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Данные для установки likes переданы некорректно'));
      } else {
        next(err);
      }
    });
};

module.exports.disLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('По указанному id карточка не найдена');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Данные для установки likes переданы некорректно'));
      } else {
        next(err);
      }
    });
};
