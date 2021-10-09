const mongoose = require('mongoose');

const afkSchema = new mongoose.Schema({
    nickname: String,
    userID: String, 
    guildID: String,
		reason: String,
})

module.exports = mongoose.model('afk', afkSchema);