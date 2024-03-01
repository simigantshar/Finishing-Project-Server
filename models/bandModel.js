const mongoose = require("mongoose");
const joi = require("joi");

const bandSchema = new mongoose.Schema(
  {
    name: String,
    company: String,
    description: String,
    img_url: Array,
    size: String,
    color: String,
    lug_width: String,
    material: String,
    buckle: String,
    type:{
        type:String,
        default:"band",
    },
    price: Number,
  },
  { timestamps: true }
);


const BandsModel = mongoose.model("bands", bandSchema);
exports.BandModel = BandsModel

exports.validateBand = (reqBody) => {
  const joiSchema = joi.object({
    name: joi.string().min(2).max(80).required(),
    company: joi.string().min(2).max(50).required(),
    description: joi.string().min(2).max(600).required(),
    img_url: joi.array().items(joi.string()).required(),
    size: joi.string().min(2).max(100).required(),
    color: joi.string().min(2).max(50).required(),
    lug_width: joi.string().min(2).max(50).required(),
    material: joi.string().min(2).max(50).required(),
    buckle: joi.string().min(2).max(80).required(),
    price: joi.number().min(1).max(999).required(),
  });
  return joiSchema.validate(reqBody);
};

// async function iterateOverBands() {
//     const bands = await BandsModel.find();
//     for (const band of bands) {
//       band.type = "band";
//       await band.save();
//     }
//   }

//   iterateOverBands();