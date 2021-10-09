const blackListServerSchema = require('../../models/blackListServerSchema');

module.exports = {
    name: 'unblacklistserver',
    aliases: ['ubls'],
    devOnly: true,
    description: 'Unblacklist a server.',

    async run (bot, message, args) {
        const guild = args[0];
        if(!guild) return message.lineReply('You gotta specify a server ID.');
        if(isNaN(guild)) return message.lineReply('Invalid ID.');
        if(!bot.guilds.cache.has(guild)) return message.lineReply(`I'm not in that server.`)

        blackListServerSchema.findOne({ guildID: guild }, async (err, data) => {
            if(!data) return message.lineReply('That server is not blacklisted.');

            data.delete();
            message.channel.send('Server unblacklisted.')
        });
    }
}