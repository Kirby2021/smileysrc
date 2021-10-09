module.exports = {
    name: 'leaveserver',
    aliases: ['leave'],
    devOnly: true,
    description: 'Make the bot to leave a server.',

    async run (bot, message, args) {
        const guild = args[0];
        if(!guild) return message.lineReply('Specify a server ID pls');
        if(isNaN(guild)) return message.line
        if(!bot.guilds.cache.has(guild)) return message.lineReply(`Server not found.`);
        
        bot.guilds.cache.get(guild).leave().then(
            message.channel.send(`I've left the server.`)
        )
    }
}