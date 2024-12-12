const { json } = require('express');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true
    },
    password: {//this should be hashed or encrypted! Do not remove this comment unless that is done!
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    // publically changable Fields:
    firstName: {
        type: String,
        required: false,
        default: ""
    },
    lastName: {
        type: String,
        required: false,
        default: ""
    },
    phoneNumber: {
        type: String,
        required: false,
        default: ""
    },
    companyName: {
        type: String,
        required: false,
        default: ""
    },

    // Buyer Fields
    ownedGoods: {
        type: [String], //TODO: Make Schema
        rqeuired: false,
        default: []
    },


    // Seller Fields
    insuranceFile: {
        type: [String],
        default: [],
        required: false
    },
    ownedWarehouses: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'warehouses' }],
        required: false,
        default: []
    },

    // Linked Objects
    transactions: {
        type: [String],
        required: false,
        default: []
    },

    // State Checks
    eligibleSeller: {
        type: Boolean,
        default: false,
        required: false
    },
    eligibleBuyer: {
        type: Boolean,
        default: false,
        required: false
    },

    verificationRequested: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

const userModel = mongoose.model('users', userSchema);
module.exports = {
    userModel,
};