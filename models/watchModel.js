const mongoose = require("mongoose");
const joi = require("joi");

const watchSchema = new mongoose.Schema(
  {
    company: String,
    family: String,
    name: String,
    ref: String,
    description: String,
    year: Number,
    category: String,
    technology: String,
    country: String,
    strap: String,
    case: String,
    dial: String,
    img_url: {
      type: [String],
      default: [],
    },
    type: {
      type: String,
      default: "watch",
    },
    price: Number,
  },
  { timestamps: true }
);

const WatchesModel = mongoose.model("watches", watchSchema);
exports.WatchModel = WatchesModel;

exports.validateWatch = (reqBody) => {
  const joiSchema = joi.object({
    company: joi
      .string()
      .min(2)
      .max(200)
      .pattern(/^[A-Z].*$/)
      .required(),
    family: joi
      .string()
      .min(2)
      .max(50)
      .pattern(/^[A-Z].*$/)
      .allow(null, ""),
    name: joi
      .string()
      .min(2)
      .max(200)
      .pattern(/^[A-Z].*$/)
      .required(),
    ref: joi.string().min(2).max(50).required(),
    description: joi
      .string()
      .min(2)
      .max(800)
      .pattern(/^[A-Z].*$/)
      .required(),
    year: joi.number().min(1800).max(2100).required(),
    category: joi
      .string()
      .min(2)
      .max(50)
      .pattern(/^[A-Z].*$/)
      .required(),
    technology: joi
      .string()
      .min(2)
      .max(50)
      .pattern(/^[A-Z].*$/)
      .required(),
    country: joi
      .string()
      .min(2)
      .max(50)
      .pattern(/^[A-Z].*$/)
      .required(),
    strap: joi
      .string()
      .min(2)
      .max(50)
      .pattern(/^[A-Z].*$/)
      .required(),
    case: joi
      .string()
      .min(2)
      .max(100)
      .pattern(/^[A-Z].*$/)
      .required(),
    dial: joi
      .string()
      .min(2)
      .max(100)
      .pattern(/^[A-Z].*$/)
      .required(),
    img_url: joi.array().required(),
    price: joi.number().min(1).max(1000000).required(),
  });
  return joiSchema.validate(reqBody);
};

// async function iterateOverWatches() {
//   try {
//     const watches = await WatchesModel.find();
//     for (const watch of watches) {
//       delete watch.img_url_2;
//       await watch.save()
//     }
//     console.log("Image URLs updated successfully.");
//   } catch (error) {
//     console.error("Error updating image URLs:", error);
//   }
// }
//
// iterateOverWatches();