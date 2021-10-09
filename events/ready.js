const Discord = require('discord.js');
const rf = require('random-facts');
const punishmentSchema = require('../models/punishmentSchema');
const punishmentSchemaAutoMod = require('../models/punishmentSchemaAutoMod');

module.exports = bot => {
    console.log(`${bot.user.username} has been connected.`)

    //https://www.youtube.com/watch?v=xvFZjo5PgG0

    const checkExpiration = async () => {
        const now = new Date();

        const warnsFind = { expires: { $lt: now }, punishmentType: "Warn" }
        const mutesFind = { expires: { $lt: now }, punishmentType: "Mute" }
        const unmutesFind = { expires: { $lt: now }, punishmentType: "Unmute" }
        const bansFind = { expires: { $lt: now }, punishmentType: "Ban" }
        const unbansFind = { expires: { $lt: now }, punishmentType: "Unban" }

        const warns = await punishmentSchema.find(warnsFind);
        const warnsAM = await punishmentSchemaAutoMod.find(warnsFind);
        const mutes = await punishmentSchema.find(mutesFind);
        const mutesAM = await punishmentSchemaAutoMod.find(mutesFind);
        const unmutes = await punishmentSchema.find(unmutesFind);
        const unmutesAM = await punishmentSchemaAutoMod.find(unmutesFind);
        const bans = await punishmentSchema.find(bansFind);
        const bansAM = await punishmentSchemaAutoMod.find(bansFind);
        const unbans = await punishmentSchema.find(unbansFind);
        const unbansAM = await punishmentSchemaAutoMod.find(unbansFind);

        if (warns && warns.length) {
            await punishmentSchema.findOneAndDelete(warnsFind);
        }

        if (warnsAM && warnsAM.length) {
            await punishmentSchemaAutoMod.findOneAndDelete(warnsFind);
        }

        if (mutes && mutes.length) {
            await punishmentSchema.findOneAndDelete(mutesFind);
        }

        if (mutesAM && mutesAM.length) {
            await punishmentSchemaAutoMod.findOneAndDelete(mutesFind);
        }

        if (unmutes && unmutes.length) {
            await punishmentSchema.findOneAndDelete(unmutesFind);
        }

        if (unmutesAM && unmutesAM.length) {
            await punishmentSchemaAutoMod.findOneAndDelete(unmutesFind);
        }

        if (bans && bans.length) {
            await punishmentSchema.findOneAndDelete(bansFind);
        }

        if (bansAM && bansAM.length) {
            await punishmentSchemaAutoMod.findOneAndDelete(bansFind);
        }

        if (unbans && unbans.length) {
            await punishmentSchema.findOneAndDelete(unbansFind);
        }

        if (unbansAM && unbansAM.length) {
            await punishmentSchemaAutoMod.findOneAndDelete(unbansFind);
        }
        setTimeout(checkExpiration, 2000)
    }
    checkExpiration()
    //---------------------------end of expiration system---------------------------//

    const statuses = ["my DMs, STREAMING", "the world burn, WATCHING", "everything goes wrong, WATCHING", "how to get free bobux, WATCHING", "don't click watch, STREAMING", "music, LISTENING", "with my cat, PLAYING", "somebody, WATCHING", "no, PLAYING", "haha yes, PLAYING", "you, WATCHING", "lol, WATCHING", "memes, WATCHING"];

    setInterval(() => {
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)].split(", ");
        const status = randomStatus[0];
        const mode = randomStatus[1];

        bot.user.setActivity(status, {
            type: mode,
            url: "https://www.youtube.com/watch?v=xvFZjo5PgG0"
        })
    }, 10000)
}