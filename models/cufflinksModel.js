const mongoose = require("mongoose");
const joi = require("joi");

const cufflinksSchema = new mongoose.Schema(
  {
    name: String,
    company: String,
    description: String,
    img_url: Array,
    type: {
      type: String,
      default: "cufflink",
    },
    price: Number,
  },
  { timestamps: true }
);

const CufflinkModel = mongoose.model("cufflinks", cufflinksSchema);
exports.CufflinksModel = CufflinkModel;

exports.validateCufflinks = (reqBody) => {
  const joiSchema = joi.object({
    name: joi.string().min(2).max(50).required(),
    company: joi.string().min(2).max(50).required(),
    description: joi.string().min(2).max(600).required(),
    img_url: joi.array().items(joi.string()).required(),
    price: joi.number().min(1).max(99999).required(),
  });
  return joiSchema.validate(reqBody);
};