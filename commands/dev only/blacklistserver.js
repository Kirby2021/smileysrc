const blackListServerSchema = require('../../models/blackListServerSchema');

module.exports = {
    name: 'blacklistserver',
    aliases: ['bls'],
    devOnly: true,
    description: 'Blacklist servers from using the bot.',

    async run (bot, message, args) {
        const guild = args[0];
        if(!guild) return message.lineReply('You gotta specify a server ID.');
        if(isNaN(guild)) return message.lineReply('Invalid ID.');
        if(!bot.guilds.cache.has(guild)) return message.lineReply(`I'm not in that server.`);

        blackListServerSchema.findOne({ guildID: guild }, async (err, data) => {
            if(data) return message.lineReply('That server is already blacklisted.');

            new blackListServerSchema({
                guildID: guild,
            }).save();
            message.channel.send('Server blacklisted.');
        });
    }
}