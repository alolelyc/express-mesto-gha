const express = require('express');

const mongoose = require('mongoose');

const cards = require('./routes/cards');
const users = require('./routes/users');
const ERR_STATUS_NOT_FOUND_404 = require('./utils/constants');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('*', (req, res) => {
  res.status(ERR_STATUS_NOT_FOUND_404).send({ message: 'Данный URL не существует' });
});

app.use((req, res, next) => {
  req.user = {
    _id: '6446c97c75d3aa25977c9e00',
  };

  next();
});

app.use('/users', users);
app.use('/cards', cards);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
