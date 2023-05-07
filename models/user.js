const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const validator = require('validator');

const UnauthorizedError = require('../errors/UnauthorizedError401');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Cсылка на изображение имеет неверный формат',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Введен некорректый адрес электронной почты',
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
  },
  { toJSON: { useProjection: true }, toObject: { useProjection: true } },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Введены неккоректные данные почты или пароля'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Введены неккоректные данные почты или пароля'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
