const express = require("express");
const { CufflinksModel, validateCufflinks } = require("../models/cufflinksModel");
const { authAdmin } = require("../middlewares/auth");
const router = express.Router();

router.get("/",async(req,res) => {
    try{
        const data = await CufflinksModel.find({});
        res.json(data);
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})

router.post("/", authAdmin, async(req,res) => {
    try{
        const validateBody = validateCufflinks(req.body);
        if(validateBody.error){
            return res.status(400).json(validateBody.error.details);
        }
        const cufflinks = new CufflinksModel(req.body);
        await cufflinks.save();
        res.status(201).json(cufflinks);
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})

module.exports = router;