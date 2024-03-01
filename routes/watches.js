const express = require("express");
const router = express.Router();
const axios = require('axios');
const { validateWatch, WatchModel } = require("../models/watchModel");
const { authAdmin } = require("../middlewares/auth");

router.get("/", async(req,res) => {
    try{
        const watch = await WatchModel.find({});
        res.json(watch);
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})

router.get("/findRef/:ref", async(req,res) => {
    const ref = req.params.ref;
    try{
        const data = await WatchModel.find({ref});
        res.json(data);
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})

router.get("/findName/:name", async(req,res) => {
    const name = req.params.name;
    try{
        const data = await WatchModel.find({name});
        res.json(data);
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})

router.post("/", authAdmin, async(req,res) => {
    const validateBody = validateWatch(req.body);
    if(validateBody.error){
        return res.status(400).json(validateBody.error.details);
    }
    try{
        const watch = new WatchModel(req.body);
        await watch.save();
        res.status(201).json(watch);
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})

router.put("/:_id", authAdmin, async(req,res) => {
    const validateBody = validateWatch(req.body);
    if(validateBody.error){
        return res.status(400).json(validateBody.error.details);
    }
    try{
        const {_id} = req.params;
        const updateWatch = await WatchModel.updateOne({_id}, req.body);
        res.json(updateWatch);
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})

router.delete("/:id", authAdmin, async(req,res) => {
    const id = req.params.id;
    try{
        const deleteWatch = await WatchModel.findOne({_id:id});
        res.json(deleteWatch);
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})

module.exports = router;