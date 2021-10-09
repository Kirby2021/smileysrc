const Discord = require('discord.js');
const prohibitedWords = require('../../data/automod.json').prohibitedWords;
const automodToggleSchema = require('../../models/automodToggleSchema');

module.exports = {
    name: 'snipe',
    aliases: ['lastmsg', 'lastmessage'],
    description: 'Get the last message deleted.',

    async run (bot, message, args) {
        var msg = bot.snipes.get(message.channel.id);
        if(!msg) return message.channel.send('There is nothing to snipe for the moment.');

		function isValidUrl(string) {
			var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,556}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
            return (res !== null)
		}

		automodToggleSchema.findOne({ guildID: message.guild.id, status: "on" }, async (err, data) => {
			if(data) {
				if(isValidUrl(msg.content) || prohibitedWords.some(w => `${msg.content.toLowerCase()}`.includes(`${w}`))) {
					return message.lineReply('The content of the message contains filtered words or links.')
				} else {
				    message.channel.send(
					    new Discord.MessageEmbed()
					    .setColor('0xb9c3c2')
					    .setAuthor(msg.author, msg.member.user.displayAvatarURL({ dynamic: true }))
					    .setDescription(msg.content)
						.setImage(msg.image)
					    .setFooter('bruh imagine sniping')
				  	)
				}
			} else {
				message.channel.send(
					new Discord.MessageEmbed()
					.setColor('0xb9c3c2')
					.setAuthor(msg.author, msg.member.user.displayAvatarURL({ dynamic: true }))
	     			.setDescription(msg.content)
					.setImage(msg.image)
					.setFooter('bruh imagine sniping')
				)
			}
		})
    }
}