const mongoose = require('mongoose');

const altSchema = new mongoose.Schema({
    guildID: String,
    status: String,
})

module.exports = mongoose.model('alt-detections', altSchema);