const Discord = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'banner',
    description: 'Get someone\'s banner.',
    
    async run (bot, message, args) {
        if(message.channel.id !== '891686229979062323') return message.lineReply('Wrong channel <a:epicjoy:868798878365913100>');

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if(!user || user.id === message.author.id) {
            axios.get(`https://discord.com/api/users/${message.author.id}`, {
                headers: {
                    Authorization: `Bot ${bot.token}`,
                },
            }).then((res) => {
                const { banner, accent_color } = res.data;

                if(banner) {
                    const extension = banner.startsWith("a_") ? '.gif' : '.png';
                    const url = `https://cdn.discordapp.com/banners/${message.author.id}/${banner}${extension}`;

                    const bannerEmbed = new Discord.MessageEmbed()
                    .setTitle('Banner')
                    .setURL(url)
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setImage(url)
                    message.channel.send(bannerEmbed)
                } else {
                    if(accent_color || !accent_color) {
                        message.lineReply(`You don't have a banner.`);
                    };
                }
            })
        } else if(user) {
            axios.get(`https://discord.com/api/users/${user.id}`, {
                headers: {
                    Authorization: `Bot ${bot.token}`,
                },
            }).then((res) => {
                const { banner, accent_color } = res.data;

                if(banner) {
                    const extension = banner.startsWith("a_") ? '.gif' : '.png';
                    const url = `https://cdn.discordapp.com/banners/${user.id}/${banner}${extension}`;

                    const bannerEmbed = new Discord.MessageEmbed()
                    .setTitle('Banner')
                    .setURL(url)
                    .setAuthor(user.user.tag, user.user.displayAvatarURL({ dynamic: true }))
                    .setImage(url)
                    message.channel.send(bannerEmbed)
                } else {
                    if(accent_color || !accent_color) {
                        message.lineReply(`That user doesn't have a banner.`);
                    };
                }
            })
        }
    }
}