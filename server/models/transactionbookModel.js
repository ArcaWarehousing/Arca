const { json } = require('express');
const mongoose = require('mongoose');
const { string } = require('yup');

const messageSchema = new mongoose.Schema({
  message: {type: String, required: true},
  person: {
    enum: ['buyer', 'seller'],
    type: String, required: true
  },
});

const requestSchema = new mongoose.Schema({
  requestedSqftPerMonth: {type: Number, required: true},
  requestedDownpaymentPercentage: {type: Number, required: true},
  message: {type: String, required: false, default: ""},
});

const transactionbookSchmea = new mongoose.Schema({
  
  associatedBuyer: { type: String, required: true },
  assocaitedSeller: { type: String, required: true },

  associatedGood: { type: String, required: true },
  associatedWarehouse: { type: String, required: true },

  requestedDuration: { type: Number, required: true },

  transactionState: { type: String, required: true,
    enum: ['waitAcceptBuyer', 'waitAcceptSeller', 'awaitingPayment',
     'active', 'closed'],
    required: true 
  },


  chat: [{ 
    type: messageSchema,
    required: false, 
    default: [] 
  }],
  requests: [{
    type: requestSchema,
    required: false,
    default: []
  }],

  showUser: { type:Boolean, requried: false, default: true},
});

const transactionbookModel = mongoose.model('transactions', transactionbookSchmea);
module.exports = transactionbookModel;