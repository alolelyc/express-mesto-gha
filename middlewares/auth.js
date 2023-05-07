const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError401');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const token = req.cookies.jwt;

  if (!token) {
    return next(new UnauthorizedError('Некорректный токен'));
  }
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, '2ce5a11f23d0823900a422f26dd4e9918701a6adaddfd3888ac5acf48833fa5d');
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
