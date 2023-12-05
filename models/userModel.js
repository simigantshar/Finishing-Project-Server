const mongoose = require("mongoose");
const Joi = require("joi");
// ספרייה שיודעת לייצר ולנהל טוקנים
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    pfp: {
      type: String,
      default: "",
    },
    // הגדרת רול כסטרינג וערך דיפולטיבי של יוזר
    role: {
      type: String,
      default: "user",
    },
    favorites: {
      type: [String],
      default: [],
    },
    order_history: {
      type: [String],
      default: [],
    },
    recent_order: {
      type: [String],
      default: [],
    },
    cart: {
      type: [String],
      default: [],
    },
  },
  // timestamps -> מוסיף מאפיינים של זמן הוספה וזמן עדכון
  { timestamps: true }
);

const UserModel = mongoose.model("users", userSchema);
exports.UserModel = UserModel;

exports.createToken = (user_id, role = "user") => {
  // מייצרים טוקן
  // פרמטר ראשון התכולה של הטוקן ,כרגע איי די בהמשך יהיה גם רול/תפקיד
  // פרמטר שני - מילה סודית בשביל לפענח את הטוקן
  // פרמטר שלישי תוקף הטוקן
  const token = jwt.sign({ _id: user_id, role }, config.TOKEN_SECRET, {
    expiresIn: "2days",
  });
  return token;
};

exports.validateUser = (_reqBody) => {
  const joiSchema = Joi.object({
    name: Joi.string().min(2).max(150).required(),
    // email() -> בודק שהמייל תקין עם שטרודל נקודה ועוד
    email: Joi.string().min(2).max(200).email().required(),
    password: Joi.string().min(3).max(150).required(),
  });

  return joiSchema.validate(_reqBody);
};

exports.validateLogin = (_reqBody) => {
  const joiSchema = Joi.object({
    email: Joi.string().min(2).max(200).email().required(),
    password: Joi.string().min(3).max(150).required(),
  });

  return joiSchema.validate(_reqBody);
};

const placeOrder = async () => {
  try {
    const users = await UserModel.find();
    for (const user of users) {
      user.recent_order = [];
      await user.save();
    }
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
};

// placeOrder();
