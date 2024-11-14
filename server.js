const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const Listing = require('./models/data'); // Assuming your model is in the "models" folder
const ServiceRequest = require('./models/service'); // Make sure the path is correct
const service = require('./models/ser')






// Initialize the app
const app = express();
app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public/images')));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());  // Enable CORS for frontend-backend communication

// MongoDB connection (adjust the MongoDB URI as necessary)
main().then(() => {
    console.log("Connected to Database & connection successful");

    // Insert sample data when server starts
    insertSampleData();  // Insert sample data on startup
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/drycleaning');
}

// Contact form schema
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    date: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Sample data insertion function for both Listings and Contacts
async function insertSampleData() {
    // Insert sample data for Contact model if the collection is empty
    const contactCount = await Contact.countDocuments();
    if (contactCount === 0) {  
        const sampleContactData = [
            {
                name: "Alice Johnson",
                email: "alice.johnson@example.com",
                message: "I need a dry cleaning service for my suits. Please let me know the prices.",
                date: new Date()
            },
            {
                name: "Bob Smith",
                email: "bob.smith@example.com",
                message: "Can I book a pickup for laundry? My address is 123 Main St.",
                date: new Date()
            },
            {
                name: "Charlie Lee",
                email: "charlie.lee@example.com",
                message: "I am interested in pressing services for my shirts. What’s the turnaround time?",
                date: new Date()
            }
        ];
        try {
            await Contact.insertMany(sampleContactData);
            console.log("Sample contact data inserted successfully!");
        } catch (err) {
            console.error("Error inserting contact sample data:", err);
        }
    } else {
        console.log("Contact collection already contains data, skipping insertion.");
    }

    // Insert sample data for Listing model if the collection is empty
    const listingCount = await Listing.countDocuments();
    if (listingCount === 0) {  
        const sampleListingData = [
            {
                title: "Dry Cleaning for Suits",
                description: "We offer professional dry cleaning services for all types of suits. Fast and reliable, we ensure your suits look as good as new.",
                image: {
                    filename: "dry-cleaning-suits.jpg",
                    url: "https://images.pexels.com/photos/19897324/pexels-photo-19897324/free-photo-of-aerial-view-of-rural-landscape.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                },
                price: 20, // Price per suit
                location: "Nandanvan",
            },
            {
                title: "Laundry Pickup & Delivery",
                description: "Our laundry service includes convenient pickup and delivery at your doorstep. We clean your clothes with care and return them fresh and folded.",
                image: {
                    filename: "laundry-pickup.jpg",
                    url: "https://images.pexels.com/photos/19897324/pexels-photo-19897324/free-photo-of-aerial-view-of-rural-landscape.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                },
                price: 15, // Price for pickup and delivery service
                location: "Lakadganj, CA.Road",
            },
            {
                title: "Shirt Pressing Service",
                description: "Get your shirts pressed and ready for any occasion. We specialize in high-quality shirt pressing to keep your attire crisp and sharp.",
                image: {
                    filename: "shirt-pressing.jpg",
                    url: "https://images.pexels.com/photos/19897324/pexels-photo-19897324/free-photo-of-aerial-view-of-rural-landscape.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                },
                price: 8, // Price per shirt
                location: "Nandanvan",
            },
            {
                title: "Blanket Washing Service",
                description: "We professionally clean blankets, duvets, and comforters. Our service guarantees a fresh and hygienic result.",
                image: {
                    filename: "blanket-washing.jpg",
                    url: "https://images.pexels.com/photos/19897324/pexels-photo-19897324/free-photo-of-aerial-view-of-rural-landscape.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                },
                price: 30, // Price for blanket washing
                location: "Nandanvan",
            },
            {
                title: "Wedding Dress Cleaning",
                description: "Trust us with your wedding dress. Our dry cleaning service will restore its beauty while preserving its delicate fabrics.",
                image: {
                    filename: "wedding-dress-cleaning.jpg",
                    url: "https://images.pexels.com/photos/19897324/pexels-photo-19897324/free-photo-of-aerial-view-of-rural-landscape.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                },
                price: 50, // Price for wedding dress cleaning
                location: "Nandanvan",
            }
        ];
        try {
            await Listing.insertMany(sampleListingData);
            console.log("Sample listing data inserted successfully!");
        } catch (err) {
            console.error("Error inserting listing sample data:", err);
        }
    } else {
        console.log("Listing collection already contains data, skipping insertion.");
    }
}


// Route to handle contact form submission
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // Create a new contact entry
    const newContact = new Contact({
        name,
        email,
        message
    });

    try {
        await newContact.save();
        res.status(201).json({ message: 'Message sent successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to send message.' });
    }
});

// Route to handle service request form submission
app.post('/api/author', async (req, res) => {
    const { name, email, clothes, pressing, laundry, dryCleaning, alterations, additionalNotes } = req.body;

    // Create a new service request entry
    const newRequest = new ServiceRequest({
        name,
        email,
        clothes,
        pressing,
        laundry,
        dryCleaning,
        alterations,
        additionalNotes  // Save the additionalNotes here
    });

    try {
        await newRequest.save();  // Save the service request to the database
        res.render("author", { submittedData: req.body });  // Redirect to the service listing page or a confirmation page
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to submit service request.' });
    }
});





// Route to display all listings
app.get("/api/list", async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("index", { allListings });  // Ensure you pass `allListings` to your EJS view
    } catch (err) {
        res.status(500).json({ message: "Error fetching listings", error: err });
    }
});

// Route for adding new listing (optional form page)
app.get("/api/new", (req, res) => {
    res.render("new"); // Assuming you have a "new.ejs" for adding new listings
});




// Route to display all service requests for admin
app.get('/admin', async (req, res) => {
    try {
        const allRequests = await ServiceRequest.find({});  // Fetch all service requests from DB
        res.render('admin', { serviceRequests: allRequests });  // Pass the data to 'admin.ejs'
    } catch (err) {
        res.status(500).json({ message: 'Error fetching service requests', error: err });
    }
});
app.get("/api/contact", (req,res)=>{
    res.render("contact.ejs")
})



app.get('/contact-list', async (req, res) => {
    try {
        const contacts = await Contact.find(); // Fetch all contact messages
        res.render('contact-list', { contacts }); // Render the contact list page and pass the data
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching contact messages');
    }
});

app.post('/api/contact-list', async (req, res) => {
    const { name, email, phone, message } = req.body;

    // Create a new contact instance with the received data
    const newContact = new Contact({
        name,
        email,
        phone,
        message
    });

    try {
        // Save the new contact instance to MongoDB
        await newContact.save();

        // Fetch all contact entries from the database
        const contacts = await Contact.find().sort({ createdAt: -1 });

        // Pass the contacts data to the template when rendering
        res.render('contact-list', { contacts }); // contacts is passed here
    } catch (err) {
        console.error('Error saving contact form data:', err);
        
        // Send an error response in case something goes wrong
        res.status(500).json({ message: 'There was an error while processing your request. Please try again later.' });
    }
});

// Default route
app.get("/", (req, res) => {
    res.send("Server is working!");
});

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
