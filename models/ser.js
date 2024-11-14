const mongoose = require('mongoose');

// Define the schema for a service
const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String, // URL of the image
      required: true,
    },
    type: {
      type: String,
      enum: ['laundry', 'pressing', 'pickup&delivery'], // Define the types
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Create the model
const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
