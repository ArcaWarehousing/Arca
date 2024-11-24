const yup = require("yup");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtAuth, sendEmail } = require("../middleware");
const { userModel } = require("../models/userModel");
const { goodsModel } = require("../models/goodsModel");

const { default: mongoose } = require("mongoose");

let goodsSchema = yup.object({
    name: yup.string().required(),
    sizeSqft: yup.number().min(0),
    approxWeight: yup.number().required().min(0),
    dateStoredTo: yup.number().required().min(new Date().getTime()),
    packingType: yup.string().default(""),
    miscDescription: yup.string().default(""),
  });

exports.uploadGoods = async (req, res) => {
    try {
        const uid = req.user.uid;
        let validatedData = await goodsSchema.validate(req.body);
        let user = await userModel.findById(req.user.uid);
        validatedData.associatedUser = uid;
        const goods = await goodsModel.create(validatedData)
        user.ownedGoods.push(goods._id);
        user.save();
        res.status(200).send({ message: "Goods uploaded successfully" });
    } catch (error) {
        res.status(500).send({ message: "Error uploading goods " + error.message});
    }
};

const outputGoodsCleaner = (good) => {
    return {
        goodId: good._id,
        associatedUser: good.associatedUser,
        associatedWarehouse: good.associatedWarehouse,
        name: good.name,
        sizeSqft: good.sizeSqft,
        approxWeight: good.approxWeight,
        dateStoredTo: good.dateStoredTo,
        packingType: good.packingType,
        miscDescription: good.miscDescription,
        pictures: good.pictures,
    };
  };

exports.getUserGoods = async(req, res) => {
    try {
        const uid = req.user.uid;
        const goods = await goodsModel.find({associatedUser: uid});
        let returnGoods = []
        for(let i=0; i < goods.length; i++) {
            if(goods[i].showUser == true)
                returnGoods.push(outputGoodsCleaner(goods[i]));
        }
        res.status(200).json(returnGoods);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updateUserGoods = async(req, res) => {
    try {
        const uid = req.user.uid;
        const user = await userModel.findById(uid);
        let validatedData = await goodsSchema.validate(req.body);
        const { goodId, associatedUser } = await yup.object({
            goodId: yup.string().required(),
        }).validate(req.body);
        
        const good = await goodsModel.findOne({associatedUser: uid, _id: goodId});
        if(good == null) throw new Error("Goods not found or invalid request");
        validatedData.associatedUser = uid;

        await goodsModel.findByIdAndUpdate(goodId, validatedData);
        const updatedGood = await goodsModel.findById(goodId);
        res.status(200).json(outputGoodsCleaner(updatedGood));
    } catch (error) {
        res.status(500).send({ message: "Error uploading goods " + error.message});
    }
};

exports.uploadPictures = async(req, res) =>{
    try {
        const { goodId } = req.params;
        const user = await userModel.findById(req.user.uid);
        if(user.ownedGoods.indexOf(goodId) == -1) throw new Error("User doesn't own this good or good doesn't exist");

        
        let good = await goodsModel.findById(goodId);
        for(let i=0; i < req.files.length; i++) {
            good.pictures.push(req.files[i].filename);
        }
        good.save();
        res.status(200).send({ message: "Pictures uploaded successfully"});

    } catch (error) {
        res.status(500).send({ message: "Error uploading goods: " + error.message});
    }
};

exports.search = async  (req, res) => {

};
