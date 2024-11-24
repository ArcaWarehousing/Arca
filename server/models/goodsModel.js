const { json } = require('express');
const mongoose = require('mongoose');
const { string } = require('yup');


const goodsSchema = new mongoose.Schema({
    associatedUser: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'users',
        required: true
    },
    associatedWarehouse: {
        type: mongoose.Schema.Types.ObjectId, ref: 'warehouses',
        required: false,
        default: null
    },
    pictures: [{
        type: String,
        required: false,
        default: []
    }],
    name: { type: String, required: true },
    sizeSqft: { type: Number, required: true },
    approxWeight: { type: Number, required: true },
    dateStoredTo: { type: Date, required: true },
    packingType: { type: String, required: false, default: ""},
    miscDescription: { type: String, required: false, default: "" },
    showUser: { type: Boolean, required: false, default: true },
});

const goodsModel = mongoose.model('goods', goodsSchema);
module.exports = {
    goodsModel,
};