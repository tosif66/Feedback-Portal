import mongoose from 'mongoose';

// Define the feedback schema for MongoDB
const feedbackSchema = new mongoose.Schema({
    // Reference to the user who submitted the feedback
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true 
    },
    // The text content of the feedback
    feedbackText: { 
        type: String, 
        required: true 
    },
    // Category of the feedback, must be one of the predefined options
    category: { 
        type: String, 
        required: true, 
        enum: ['Bug', 'Feature Request', 'General'], // Example categories
    },
    // Priority level of the feedback, must be one of the predefined options
    priority: { 
        type: String, 
        required: true, 
        enum: ['Low', 'Medium', 'High'], // Priority levels
    },
    // Timestamp for when the feedback was created, defaulting to the current date
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
},{timestamp : true});

// Export the feedback model for use in other parts of the application
export default mongoose.model('Feedback', feedbackSchema);
