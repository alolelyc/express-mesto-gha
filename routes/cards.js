const router = require('express').Router();
const {
  getCards, createCard, delCardById, likeCard, disLikeCard,
} = require('../controllers/cards');

const {
  validationCreateCard,
  validationCardId,
} = require('../middlewares/validators/cardValidation');

router.get('/', getCards);
router.post('/', validationCreateCard, createCard);
router.delete('/:cardId', validationCardId, delCardById);
router.put('/:cardId/likes', validationCardId, likeCard);
router.delete('/:cardId/likes', validationCardId, disLikeCard);

module.exports = router;
