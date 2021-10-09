const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    userID: String,
    reason: String
})

module.exports = mongoose.model('blacklistedusers', blacklistSchema);