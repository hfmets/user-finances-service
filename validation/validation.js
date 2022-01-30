const Joi = require("joi");

const buySchema = Joi.object({
  ticker: Joi.string().required(),
  value: Joi.number().positive().required(),
  sharesTransacted: Joi.number().positive().required(),
  userId: Joi.string().required(),
  holdingKind: Joi.string().valid("stock", "fund").required(),
});

const sellSchema = Joi.object({
  ticker: Joi.string().required(),
  sharesTransacted: Joi.number().positive().required(),
  userId: Joi.string().required(),
});

module.exports = {
  buySchema,
  sellSchema,
};
