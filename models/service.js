const mongoose = require('mongoose');

// Define the schema for a service request
const serviceRequestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    clothes: { type: Number, default: 0 },
    pressing: { type: Number, default: 0 },
    laundry: { type: Number, default: 0 },
    dryCleaning: { type: Number, default: 0 },
    alterations: { type: Number, default: 0 },
    additionalNotes: { type: String, default: "" },
    date: { type: Date, default: Date.now },
});

// Create the model
const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);

module.exports = ServiceRequest;
