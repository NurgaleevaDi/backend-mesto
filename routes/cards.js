const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('', getCards);
router.post(
  '',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(/^https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-._~:/?#[\]@!$&'()*+,;=]{2,}#?$/),
    }),
  }),
  createCard,
);
router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24).hex(),
    }),
  }),
  deleteCard,
);
router.put(
  '/:cardsId/likes',
  celebrate({
    params: Joi.object().keys({
      cardsId: Joi.string().required().length(24).hex(),
    }),
  }),
  likeCard,
);
router.delete(
  '/:cardsId/likes',
  celebrate({
    params: Joi.object().keys({
      cardsId: Joi.string().required().length(24).hex(),
    }),
  }),
  dislikeCard,
);

module.exports = router;
