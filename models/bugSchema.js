const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema({
    userID: String,
    bug: String,
})

module.exports = mongoose.model('bugs', bugSchema);