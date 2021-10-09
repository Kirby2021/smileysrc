const mongoose = require('mongoose');

const blackListServerSchema = new mongoose.Schema({
    guildID: String,
})

module.exports = mongoose.model('blacklisted-servers', blackListServerSchema);