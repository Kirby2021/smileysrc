const Discord = require('discord.js');

module.exports = {
    name: 'clyde',

    async run (bot, message, args) {
			if(message.channel.id !== '891686229979062323') return message.lineReply('*Wrong channel*');
			
        const text = args.splice(0).join(" ");
        if(!text) return message.lineReply('Provide a text dumbass');

        const url = `https://ctk-api.herokuapp.com/clyde/${text}`;

        message.lineReplyNoMention(
            new Discord.MessageAttachment(url, "clyde.png")
        )
    }
}