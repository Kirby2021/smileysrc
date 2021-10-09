const mongoose = require('mongoose');

const prefixSchema = new mongoose.Schema({
    guildName: String,
    guildID: String,
    prefix: String,
})

module.exports = mongoose.model('prefixes', prefixSchema);