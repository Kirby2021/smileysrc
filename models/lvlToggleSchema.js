const mongoose = require('mongoose');

const lvlToggleSchema = new mongoose.Schema({
    guildID: String,
    status: String,
})

module.exports = mongoose.model('toggled-levels', lvlToggleSchema);