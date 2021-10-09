const Discord = require('discord.js');
const levels = require('discord-xp');
const canvacord = require('canvacord');

module.exports = {
    name: 'rank',
    aliases: ['level', 'lvl'],
    description: 'Check your rank.',

    async run (bot, message, args) {
        if(message.channel.id !== '891686229979062323') return message.lineReply('Wrong channel <a:epicBruh:868797442508881990>');

        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if(target) {
            const user = await levels.fetch(target.id, message.guild.id);

            if(!user) return message.lineReply('That user is not even level 1.');
    
            const neededXp = levels.xpFor(parseInt(user.level) + 1);
    
            const imgBackground = 'https://cdn.discordapp.com/attachments/848559419532378112/878609109249826856/PicsArt_08-21-01.58.39.jpg'; //700px x 250px
    
            const rankCard = new canvacord.Rank()
            .setBackground("IMAGE", imgBackground)
            .setRank(1, "RANK", false)
            .setLevel(user.level)
            .setAvatar(target.user.displayAvatarURL({ dynamic: false, format: 'png' }))
            .setCurrentXP(user.xp)
            .setRequiredXP(neededXp)
            .setStatus(target.user.presence.status)
            .setProgressBar('#ffe182', "COLOR")
            .setUsername(target.user.username)
            .setDiscriminator(target.user.discriminator)
    
            rankCard.build()
            .then(data => {
                const attachment = new Discord.MessageAttachment(data, "rank.png");
                message.channel.send(attachment);
            });
        } else {
            const user = await levels.fetch(message.author.id, message.guild.id);

            if(!user) return message.lineReply('You are not even level 1.');
    
            const neededXp = levels.xpFor(parseInt(user.level) + 1);
    
            const imgBackground = 'https://cdn.discordapp.com/attachments/848559419532378112/878609109249826856/PicsArt_08-21-01.58.39.jpg'; //700px x 250px
    
            const rankCard = new canvacord.Rank()
            .setBackground("IMAGE", imgBackground)
            .setRank(1, "RANK", false)
            .setLevel(user.level)
            .setAvatar(message.author.displayAvatarURL({ dynamic: false, format: 'png' }))
            .setCurrentXP(user.xp)
            .setRequiredXP(neededXp)
            .setStatus(message.author.presence.status)
            .setProgressBar('#ffe182', "COLOR")
            .setUsername(message.author.username)
            .setDiscriminator(message.author.discriminator)
    
            rankCard.build()
            .then(data => {
                const attachment = new Discord.MessageAttachment(data, "rank.png");
                message.channel.send(attachment);
            });
        }
    }
}