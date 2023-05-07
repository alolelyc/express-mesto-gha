const { celebrate, Joi } = require('celebrate');
const { regex } = require('../../utils/constants');

const validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(regex),
  }),
});

const validationCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  validationCreateCard,
  validationCardId,
};
