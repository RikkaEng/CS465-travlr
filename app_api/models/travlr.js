const mongoose = require('mongoose');

// Define the trip schema
const tripSchema = new mongoose.Schema({
    code: { 
        type: String, 
        required: [true, 'Trip code is required'],
        unique: true,
        trim: true,
        maxlength: [10, 'Trip code cannot exceed 10 characters'],
        index: true 
    },
    name: { 
        type: String, 
        required: [true, 'Trip name is required'],
        trim: true,
        maxlength: [100, 'Trip name cannot exceed 100 characters'],
        index: true 
    },
    length: { 
        type: String, 
        required: [true, 'Trip length is required'],
        trim: true,
        maxlength: [50, 'Trip length cannot exceed 50 characters']
    },
    start: { 
        type: Date, 
        required: [true, 'Start date is required']
    },
    resort: { 
        type: String, 
        required: [true, 'Resort name is required'],
        trim: true,
        maxlength: [100, 'Resort name cannot exceed 100 characters']
    },
    perPerson: { 
        type: Number,  
        required: [true, 'Price per person is required'],
        min: [0, 'Price cannot be negative']
    },
    image: { 
        type: String, 
        required: false,  // Made optional - not all trips may have images yet
        trim: true,
        maxlength: [500, 'Image URL cannot exceed 500 characters']
    },
    description: { 
        type: String, 
        required: false,  // Made optional
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    }
});

// Add a compound text index for full-text search
tripSchema.index({ 
    name: 'text', 
    resort: 'text', 
    description: 'text' 
});

const Trip = mongoose.model('trips', tripSchema);
module.exports = Trip;