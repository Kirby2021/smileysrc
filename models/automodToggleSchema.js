const mongoose = require('mongoose');

const automodToggleSchema = new mongoose.Schema({
    guildID: String,
    status: String,
})

module.exports = mongoose.model('disabled-automod', automodToggleSchema);