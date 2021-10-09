const ms = require('ms');
const timeSpan = ms('2 days');
const Discord = require('discord.js');
const altSchema = require('../models/altSchema');
const moment = require('moment');
const verifySchema = require('../models/verifySchema');
const levels = require('discord-xp');

module.exports = async (bot, member) => {
    if(member.user.bot) return member.roles.add('888532426043822110');

    altSchema.findOne({ guildID: member.guild.id }, async (err, data) => {
        if(data) {
            if(data.status == 'on') {
                const createdAt = new Date(member.user.createdAt).getTime();
                const difference = Date.now() - createdAt;
            
                if(difference < timeSpan) {
                    try {
                        member.send(
                            new Discord.MessageEmbed()
                            .setColor('0xdd5353')
                            .setTitle(`You've been kicked from ${member.guild.name}`)
                            .setAuthor('Alt Detection System', bot.user.displayAvatarURL())
                            .setTimestamp()
                            .setDescription(`You've been kicked from ${member.guild.name} because we suspect you are an alt account as this server doesn't admit alt accounts.\n\nThis kick has made by **automod**.`)
                        ).then(member.kick({ reason: 'Probably alt account [Automod]' }))
                    } catch(err) {
                        console.log(err)
                    }
                }
            }
        } else return;
    })

    const user = levels.fetch(member.id, member.guild.id);
            
    if(user.level == '5') {
        member.roles.add('888731830264660018')
    } else if(user.level == '10') {
        member.roles.add('888731297999114280')
    } else if(user.level == '15') {
        member.roles.add('888730716953788437')
    } else if(user.level == '25') {
        member.roles.add('888728448518995968')
    } else if(user.level == '30') {
        member.roles.add('888726836375330816')
    } else if(user.level == '50') {
        member.roles.add('888726836018835467')
    } else if(user.level == '70') {
        member.roles.add('888725532655636480')
    }

    verifySchema.findOne({ guildID: member.guild.id, userID: member.id }, async (err, data) => {
        if(data) {
            member.roles.add('888736820718870549') //888736820718870549
        } else member.roles.add('888732509066629160') //888732509066629160
    })


    const date = moment(member.user.createdAt).format('ddd, DD MMM YYYY');
    const hours = moment(member.user.createdAt).format('HH');
    const minutes = moment(member.user.createdAt).format('mm');
    const seconds = moment(member.user.createdAt).format('ss');
    const ampm = moment(member.user.createdAt).format('A');

    const createdAt = `${date} at ${hours}:${minutes}:${seconds} ${ampm}`;

    member.guild.channels.cache.get('888841187094581259').send(
        new Discord.MessageEmbed()
        .setColor('0xF4C7FE')
        .setTitle('New join')
        .addFields(
            { name: "Member", value: `${member} - ${member.id}` },
            { name: 'Registered', value: createdAt },
            { name: 'Member count', value: member.guild.members.cache.filter(b => !b.user.bot).size },
        )
        .setFooter(member.user.username, member.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
    )
}