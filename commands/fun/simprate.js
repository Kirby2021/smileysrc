const Discord = require('discord.js');

module.exports = {
    name: 'simprate',

    async run (bot, message, args) {
        const user = message.mentions.users.first() || message.author;

        let porcent = Math.floor(Math.random() * 101);

        const simprateMachine = new Discord.MessageEmbed()
        .setTitle('Simp calculator')
        .setDescription(`${user.username} is ${porcent}% simp`)
        message.channel.send(simprateMachine)
    }
}