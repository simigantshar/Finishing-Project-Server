const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  UserModel,
  validateUser,
  validateLogin,
  createToken,
} = require("../models/userModel");
const { auth, authAdmin } = require("../middlewares/auth");
const { WatchModel } = require("../models/watchModel");
const { BandModel } = require("../models/bandModel");
const { CufflinksModel } = require("../models/cufflinksModel");
const router = express.Router();

router.get("/", async (req, res) => {
  res.json({ msg: "Users endpoint" });
});

router.get("/checkToken", auth, async(req,res) => {
  return res.json(req.tokenData);
});

// auth -> קורא קודם לפונקציית מיידל וואר שבודקת אם יש טוקן
router.get("/userInfo", auth, async (req, res) => {
  try {
    const user = await UserModel.findOne(
      { _id: req.tokenData._id },
      { password: 0 }
      );
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.get("/favorites", auth, async(req,res) => {
  try{
    const user = await UserModel.findById(req.tokenData._id);
    const favoriteWatches = await WatchModel.find({_id:user.favorites});
    const favoriteBands = await BandModel.find({_id:user.favorites});
    const favoriteCufflinks = await CufflinksModel.find({_id:user.favorites});
    const favoriteProducts = [].concat(favoriteBands, favoriteCufflinks, favoriteWatches);
    res.json(favoriteProducts);
  }
  catch(err){
    console.log(err);
    res.status(500).json({err})
  }
});

// router.get("/favorites", auth, async(req,res) => {
//   try{
//     const user = await UserModel.findById(req.tokenData._id);
//     const favoriteProducts = await WatchModel.find({_id:user.favorites});
//     res.json(favoriteProducts);
//   }
//   catch(err){
//     console.log(err);
//     res.status(500).json({err})
//   }
// });

router.get("/cart", auth, async(req,res) => {
  try{
    const user = await UserModel.findById(req.tokenData._id);
    const cartWatches = await WatchModel.find({_id:user.cart});
    const cartBands = await BandModel.find({_id:user.cart});
    const cartCufflinks = await CufflinksModel.find({_id:user.cart});
    const cartProducts = [].concat(cartWatches, cartBands, cartCufflinks);
    res.json(cartProducts);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

// authAdmin -> נותן הרשאה רק למי שהוא אדמין או סופר אדמין
// router.get("/usersList", authAdmin, async (req, res) => {
//   try {
//     const data = await UserModel.find({}, { password: 0 })
//     res.json(data)
//   }
//   catch (err) {
//     console.log(err);
//     res.status(502).json({ err })
//   }
// })

router.post("/", async (req, res) => {
  const validBody = validateUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const user = new UserModel(req.body);
    // הצפנה של הסיסמא
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    // שינוי תצוגת הסיסמא לצד לקוח המתכנת
    user.password = "********";
    res.status(201).json(user);
  } catch (err) {
    if (err.code == 11000) {
      return res
        .status(401)
        .json({ err: "Email already in system", code: 11000 });
    }
    console.log(err);
    res.status(502).json({ err });
  }
});

router.post("/login", async (req, res) => {
  const validBody = validateLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    // בודק אם המייל שנשלח בכלל קיים במסד
    // findOne -> מוצא אחד בלבד ומחזיר אובייקט,אם לא מוצא מחזיר אנדיפיינד
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ msg: "Email not found!" });
    }
    // אם הסיסמא מתאימה לרשומה שמצאנו במסד שלנו כמוצפנת
    //  bcrypt.compare -> בודק אם הסיסמא שהגיע מהצד לקוח בבאדי
    // תואמת לסיסמא המוצפנתת בסיסמא
    const passwordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordValid) {
      return res.status(401).json({ msg: "Password wrong!" });
    }
    const token = createToken(user._id, user.role);
    res.json({ token });
    // לשלוח טוקן
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

// router.post("/favorite", auth, async (req, res) => {
  //   try{
    //       const userData = req.tokenData;
    //       console.log({ userData, body: req.body });
    //       const user = await UserModel.findById(userData._id)
    //       user.favorites.push(req.body.productId)
    //       await user.save();
    //       res.json({ success: true });
    //   }
    //   catch(err){
      //     console.log(err);
//     res.status(502).json({err})
//   }
// });

router.post("/isFavorite", auth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.tokenData._id);
    const isFavs = user.favorites.find((item) => item == req.body.productId);
    if(isFavs){
      return res.json(true);
    }
    else{
      return res.json(false);
    }
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.patch("/favorite/:_id", auth, async(req,res) => {
  try{
    const {_id} = req.params;
    const watchProduct = await WatchModel.findById(_id);
    const bandProduct = await BandModel.findById(_id);
    const cufflinksProduct = await CufflinksModel.findById(_id);
    let product;
    if(watchProduct){
      product = watchProduct;
    }
    else if(bandProduct){
      product = bandProduct;
    }
    else{
      product = cufflinksProduct;
    }
    if(!product){
      return res.status(400).json({err:"product not found!"});
    }
    const user = await UserModel.findById(req.tokenData._id);
    if(user.favorites.find((item) => item == _id)){
      user.favorites = user.favorites.filter((item) => item != _id);
      await user.save();
      return res.json({msg:"removed from favorites!"});
    }
    else{
      user.favorites.push(_id);
      await user.save();
      return res.json({msg:"added to favorites!"});
    }
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

// router.patch("/favorite/:_id", auth, async(req,res) => {
//   try{
//     const {_id} = req.params;
//     const product = await WatchModel.findById(_id);
//     if(!product){
//       return res.status(400).json({err:"product not found!"});
//     }
//     const user = await UserModel.findById(req.tokenData._id);
//     if(user.favorites.find((item) => item == _id)){
//       user.favorites = user.favorites.filter((item) => item != _id);
//       await user.save();
//       return res.json({msg:"removed from favorites!"});
//     }
//     else{
//       user.favorites.push(_id);
//       await user.save();
//       return res.json({msg:"added to favorites!"});
//     }
//   }
//   catch(err){
//     console.log(err);
//     res.status(502).json({err})
//   }
// })

router.patch("/addCart/:_id", auth, async(req,res) => {
  try{
    const {_id} = req.params;
    const product = await WatchModel.findById(_id);
    if(!product){
      return res.status(400).json({err:"product not found!"});
    }
    const user = await UserModel.findById(req.tokenData._id)
      user.cart.push(_id);
      await user.save();
      res.json({msg:"added to cart!"});
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.patch("/removeCart/:_id", auth, async(req,res) => {
  try{
    const {_id} = req.params;
    const user = await UserModel.findById(req.tokenData._id);
    if(user.cart.find((item) => item == _id)){
      user.cart = user.cart.filter((item) => item != _id);
      await user.save();
      res.json({msg:"removed from cart!"});
    }
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

// אדמין יוכל להפוך משתמש לאדמין או למשתמש רגיל
router.patch("/changeRole/:id/:role", authAdmin, async (req, res) => {
  try {
    const { id, role } = req.params;
    if (role != "user" && role != "admin") {
      return res.status(401).json({ err: "Role must be 'user' or 'admin'" });
    }
    // אדמין לא יוכל לשנות את עצמו
    if (id == req.tokenData._id) {
      return res.status(401).json({ err: "You cant change your own role" });
    }
    // RegExp -> פקודת שלילה חייבת לעבוד עם ביטוי רגולרי
    // כדי לדאוג שלא נוכל להשפיע על סופר אדמין
    const data = await UserModel.updateOne(
      { _id: id, role: { $not: new RegExp("superadmin") } },
      { role }
    );
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.delete("/:id", authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    // אדמין לא יוכל לשנות את עצמו
    if (id == req.tokenData._id) {
      return res.status(401).json({ err: "you cant delete your self" });
    }
    // RegExp -> פקודת שלילה חייבת לעבוד עם ביטוי רגולרי
    // כדי לדאוג שלא נוכל להשפיע על סופר אדמין
    const data = await UserModel.deleteOne({
      _id: id,
      role: { $not: new RegExp("superadmin") },
    });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

module.exports = router;
