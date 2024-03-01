const express = require("express");
const router = express.Router();
const {BandModel, validateBand} = require("../models/bandModel");
const { authAdmin } = require("../middlewares/auth");

router.get("/", async(req,res) => {
    try{
        const data = await BandModel.find({});
        res.json(data);
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})

router.post("/", authAdmin, async(req,res) => {
    try{
        const validateBody = validateBand(req.body);
        if(validateBody.error){
            return res.status(400).json(validateBody.error.details);
        }
        const band = new BandModel(req.body);
        await band.save();
        res.status(201).json(band);
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})

module.exports = router;