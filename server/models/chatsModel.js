const { json } = require('express');
const mongoose = require('mongoose');


const chatsSchema = new mongoose.Schema({
  associated_user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true }
  },
  size_sq_ft: { type: Number, required: true },
  price_per_month: { type: Number, required: true },
  type: { type: String, required: true },
  lease_type: { type: String, required: true },
  features: [{ type: String }],
  proximity: {
    major_highways: { type: String },
    nearest_port_airport: { type: String }
  },
  access: [{ type: String }],
  special_requirements: [{ type: String }],
  availability: { type: String, required: true },
  additional_services: [{ type: String }]
});

const chatSchema = mongoose.model('chats', chatsSchema);
module.exports = chatSchema;