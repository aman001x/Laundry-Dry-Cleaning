const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true }
}, { timestamps: true }); // Adding timestamps to automatically add createdAt and updatedAt

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
