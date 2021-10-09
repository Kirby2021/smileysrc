const mongoose = require('mongoose');

const toggleCommandSchema = new mongoose.Schema({
    guildID: String,
    command: String,
})

module.exports = mongoose.model('disabled-cmds', toggleCommandSchema);