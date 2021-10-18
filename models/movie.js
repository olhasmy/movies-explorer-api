const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: "Number",
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (url) => /^(http|https):\/\/[^ "]+$/.test(url),
      message: 'Неверные данные',
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: (url) => /^(http|https):\/\/[^ "]+$/.test(url),
      message: 'Неверные данные',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (url) => /^(http|https):\/\/[^ "]+$/.test(url),
      message: 'Неверные данные',
    },
  },
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  movieId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
