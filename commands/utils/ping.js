const Discord = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'ping',
    aliases: ['pong'],
    description: 'Get the bot\'s ping.',
		
    async run (bot, message, args) {

        function duration(ms) {
            const hours = Math.floor((ms / (1000 * 60 * 60)) % 60).toString();
            const minutes = Math.floor((ms / (1000 * 60)) % 60).toString();
            const seconds = Math.floor((ms / 1000) % 60).toString();
            return hours.padStart(2, '0') + ':' + minutes.padStart(2, '0') + ':' + seconds.padStart(2, '0');
        }

        const uptime = duration(bot.uptime)

        message.channel.send('Checking <a:loading:876855895999512626>').then(m => {
            const pingEmbed = new Discord.MessageEmbed()
            .setColor('0x303136')
            .setTitle(`${bot.user.username}'s ping`)
            .setAuthor(bot.user.username, bot.user.displayAvatarURL({ dynamic: true }))
            .setFooter('hmmm..')
            .setTimestamp()
            .addFields(
                { name: 'Ping', value: `${bot.ws.ping} ms`, inline: true },
                { name: 'Uptime', value: uptime, inline: true },
            )

            m.delete().then(message.channel.send(pingEmbed))
        })
    }
}