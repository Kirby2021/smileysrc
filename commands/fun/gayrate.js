const Discord = require('discord.js');

module.exports = {
    name: 'gayrate',
    aliases: ['howgay'],
    description: 'How gay are you?',

    async run (bot, message, args) {
        const user = message.mentions.members.first();

        let porcent = Math.floor(Math.random() * 101);

        if(!user || user.id === message.author.id) {
            message.lineReply(
                new Discord.MessageEmbed()
                .setColor('0x303136')
                .setTitle('Gay Calculator')
                .setDescription(`You are ${porcent}% gay 🏳️‍🌈`)
            )
        } else if(user) {
            message.lineReply(
                new Discord.MessageEmbed()
                .setColor('0x303136')
                .setTitle('Gay Calculator')
                .setDescription(`${user.user.username} is ${porcent}% gay 🏳️‍🌈`)
            )
        }
    }
}