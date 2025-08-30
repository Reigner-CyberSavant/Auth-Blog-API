const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: [true, "Title must be trimmed"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: [true, "Description must be trimmed"],
    },   
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User ID is required"], 
    },
},{Timestamps: true

});



module.exports = mongoose.model("Post", postSchema);