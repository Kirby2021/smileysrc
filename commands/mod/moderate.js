const Discord = require('discord.js');

module.exports = {
    name: 'moderate',
    aliases: ['mod'],
    description: 'Moderate someone\'s nickname.',

    async run (bot, message, args) {
        if(!message.member.hasPermission('MANAGE_NICKNAMES')) return message.delete();

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!user) return message.lineReply('Provide a user dumbass')
        if(user.id === message.author.id) {
            try {
                message.author.setNickname('the clown').then(message.lineReply('Done.'))
            } catch(err) {
                console.log(err);
                return message.lineReply('Do it yourself bruh')
            }
        }
        if(user.id === message.guild.ownerID) return message.lineReply(`You can't moderate the owner's nickname lol`);
        if(user.user.bot) return message.lineReply('You cannot moderate bots nickname, dumb human <:megaJoy:850767631597830165>');

        function generateRandomID(length) {
            var random_string = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz';
            for (var i, i = 0; i < length; i++) {
                random_string += characters.charAt(Math.floor(Math.random() * characters.length))
            }
            return random_string;
        }

        const randomChar = generateRandomID(7);
        const moderatedNickname = `Moderated Nickname ${randomChar}`;

        try {
            user.setNickname(moderatedNickname).then(message.channel.send(`Moderated name to \`${moderatedNickname}\``))
        } catch(err) {
            console.log(err);
            message.channel.send('Error!')
        }

        try {
            user.send(
                new Discord.MessageEmbed()
                .setColor('0x303136')
                .setTitle('Nickname Moderated')
                .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                .setTimestamp()
                .addField('Possible reasons', '• Your nickname is not typeable in the QWERTY English keyboard.\n• Your nickname was inappropiate.\n• You nickname was not mentionable.\n• Your nickname has the same name as a YouTuber/Streamer/Someone in the internet which is known.')
                .setDescription('If you want to change it, you can with Level +15 but you have to have an appropiate nickname. Or else, you can ask a staff member to change it to something else.')
            )
        } catch(err) {
            console.log(err)
        }
    }
}