const Discord = require('discord.js');
const moment = require('moment');

module.exports = async (bot, member) => {
    if(member.user.bot) return;

    const date = moment(member.user.createdAt).format('ddd, DD MMM YYYY');
    const hours = moment(member.user.createdAt).format('HH');
    const minutes = moment(member.user.createdAt).format('mm');
    const seconds = moment(member.user.createdAt).format('ss');
    const ampm = moment(member.user.createdAt).format('A');

    const createdAt = `${date} at ${hours}:${minutes}:${seconds} ${ampm}`;

    const dateJ = moment(member.user.joinedAt).format('ddd, DD MMM YYYY');
    const hoursJ = moment(member.user.joinedAt).format('HH');
    const minutesJ = moment(member.user.joinedAt).format('mm');
    const secondsJ = moment(member.user.joinedAt).format('ss');
    const ampmJ = moment(member.user.joinedAt).format('A');

    const joinedAt = `${dateJ} at ${hoursJ}:${minutesJ}:${secondsJ} ${ampmJ}`;

    member.guild.channels.cache.get('888841187094581259').send(
        new Discord.MessageEmbed()
        .setColor('0xF4C7FE')
        .setTitle('New leave')
        .addFields(
            { name: 'Member', value: `${member} - ${member.id}` },
            { name: 'Registered', value: createdAt },
            { name: 'Joined', value: joinedAt },
        )
        .setFooter(member.user.username, member.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
    )
}