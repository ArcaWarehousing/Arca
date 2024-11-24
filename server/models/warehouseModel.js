const { json } = require('express');
const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  associatedUser: {
    type: mongoose.Schema.Types.ObjectId, ref: 'users',
    required: true
  },
  name: { type: String, required: true},
  // User inputted info
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
  },
  pictures: [{ type: String, required: false, default: [] }],
  verificationPaperwork: [{ type: String, required: false, default: [] }],
  description: { type: String, required: false, default: ""},

  totalSqft: { type: Number, required: true },
  externalUsedSqft: { type: Number, required: true },
  availableSqft: { type: Number, required: true },
  princePerSqftPerMonth: { type: Number, required: true },
  downpaymentPercentage: { type: Number, required: true },

  warehouseType: {
    type: String,
    enum: ['Public', 'Private', 'Shared', 'Specalized'],
    defualt: 'Public',
    required: true 
  },
  refrigerated: { type: Boolean, required: true, default: false },
  ceilingHeight: { type: Number, required: true },
  loadingDocks: { type: Number, required: true },
  securityCameras: { type: Boolean, required: true, default: false },
  securityGuards: { type: Boolean, required: true, default: false },

  specialFeatures: {type: String, required: false, defualt: " "},
  
  // Lined objects
  showUser: {type: Boolean, default: true, required: false},
  
  // State
  verified: {type: Boolean, required: false, default: false},
  publiclySearchable: {type: Boolean, required: false, default: false},
  
  storedGoods: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'storedGoods',
    required: false,
    default: []
  }]
  
});

const warehouseModel = mongoose.model('warehouses', warehouseSchema);
module.exports = {warehouseModel};