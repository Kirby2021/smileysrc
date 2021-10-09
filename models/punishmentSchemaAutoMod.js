const mongoose = require('mongoose');

const punishmentSchemaAutoMod = new mongoose.Schema({

    time: String,
    punishmentType: String,
    guildName: String,
    guildID: String,
    userID: String,
    punishmentID: String,
    expires: Date,

    punishmentInfo: [Object],
})

module.exports = mongoose.model('automods', punishmentSchemaAutoMod);