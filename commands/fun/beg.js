const Discord = require('discord.js');

module.exports = {
    name: 'beg',
    description: 'Beg.',
    
    async run (bot, message, args) {
        if(message.channel.id !== '891686229979062323') return message.lineReply('This is not a good place to beg.');

        var randomEmbed = new Discord.MessageEmbed()
        .setColor('0xdd5353')
        .addField('Someone who doesn\'t know their name', '"Ewww.. Get the hell away from me pls"')
        .setFooter('imagine begging lol')
    
        var randomEmbed2 = new Discord.MessageEmbed()
        .setColor('0x7cc576')
        .addField('Joe mama', '"i just give you money cuz you have a good cock"')
        .setFooter('ez money')
    
        var randomEmbed3 = new Discord.MessageEmbed()
        .setColor('0xffe182')
        .addField('Lucas', `I don't have money, sorry.`)
        .setFooter('you tried')
    
        var randomEmbed4 = new Discord.MessageEmbed()
        .setColor('0xffe182')
        .addField('Pablo', `Good evening m'lady.`)
        .setFooter('this dude is so weird')
    
        var randomEmbed5 = new Discord.MessageEmbed()
        .setColor('0xdd5353')
        .addField('IdontKnowMyName', '"No, f*ck off."')
        .setFooter('imagine begging lol')
        
        var randomEmbed6 = new Discord.MessageEmbed()
        .setColor('0xdd5353')
        .addField('MrBeast', '"I already gave money to Palestine and Israel."')
        .setFooter('imagine begging lol')
        
        var randomEmbed7 = new Discord.MessageEmbed()
        .setColor('0x7cc576')
        .addField('Rick Astley', '"Alright, but can you watch this [video](https://www.youtube.com/watch?v=dQw4w9WgXcQ "click pls") pls."')
        .setFooter('ez mone')
    
        var randomEmbed8 = new Discord.MessageEmbed()
        .setColor('0xffe182')
        .addField('XXXTentacion', `Sorry, I'm dead.`)
        .setFooter('f')
    
        var randomEmbed8 = new Discord.MessageEmbed()
        .setColor('0x7cc576')
        .addField('Mom', 'get a job')
        .setFooter('ez')
    
        var randomEmbed9 = new Discord.MessageEmbed()
        .setColor('0xdd5353')
        .addField('Roblox', `**Account Deleted**\n\nReason: Begging.\nModerator note: Dude imagine begging, can you get some life?\n\nOffensive item: ${message.content}\nYour account has been terminated.`)
        .setFooter('imagine begging bru')
    
        var randomEmbed10 = new Discord.MessageEmbed()
        .setColor('0x7cc576')
        .addField('Epic Games', 'Here some nitro for 3 months.')
        .setFooter('Now you have nitro')
    
        var randomMessages = [randomEmbed, randomEmbed2, randomEmbed3, randomEmbed4, randomEmbed5, randomEmbed6, randomEmbed7, randomEmbed8, randomEmbed9, randomEmbed10];
    
        var random = Math.floor((Math.random() * randomMessages.length));
        message.lineReply(randomMessages[random])
    }
}