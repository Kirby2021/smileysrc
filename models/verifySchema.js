const mongoose = require('mongoose');

const verifySchema = new mongoose.Schema({
    guildID: String,
    userID: String,
})

module.exports = mongoose.model('verified-users', verifySchema);