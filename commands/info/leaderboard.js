const Discord = require('discord.js');
const levels = require('discord-xp');

module.exports = {
    name: 'leaderboard',
    aliases: ['lb'],
    cooldown: 1000 * 5,
    description: 'Get the leaderboard of the server.',

    async run (bot, message, args) {
        if(message.channel.id !== '891686229979062323') return message.lineReply('Wrong channel <a:epicBruh:868797442508881990>');

        const rawLeaderboard = await levels.fetchLeaderboard(message.guild.id, 5);

        if(rawLeaderboard < 1) return message.lineReply(`No one's in the leaderboard yet.`);

        const leaderboard = await levels.computeLeaderboard(bot, rawLeaderboard, true);

        const lb = leaderboard.map(e => `${e.position}. ${e.username}#${e.discriminator}\nLevel: ${e.level}\nXP: ${e.xp.toLocaleString()}`);

        message.channel.send(
            new Discord.MessageEmbed()
            .setColor('0x303236')
            .setTitle(`${message.guild.name}'s leaderboard`)
            .setDescription(lb.join("\n\n"))
            .setTimestamp()
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
        )
    }
}