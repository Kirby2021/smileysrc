const Discord = require('discord.js');

module.exports = {
    name: 'halalrate',

    async run (bot, message, args) {
        const user = message.mentions.users.first();

        let porcent = Math.floor(Math.random() * 100);

        if(!user || user.id === message.author.id) {
            message.lineReply(
                new Discord.MessageEmbed()
                .setColor('0x303136')
                .setTitle('Halal Calculator')
                .setDescription(`You are ${porcent}% halal 🏳️‍🌈`)
            )
        } else if(user) {
            message.lineReply(
                new Discord.MessageEmbed()
                .setColor('0x303136')
                .setTitle('Halal Calculator')
                .setDescription(`${user.user.username} is ${porcent}% halal 🏳️‍🌈`)
            )
        }
    }
}