const Discord = require('discord.js');
const verifySchema = require('../../models/verifySchema');
const { MessageButton } = require('discord-buttons');
const ms = require('ms');

module.exports = {
    name: 'sendverify',

    async run (bot, message, args) {
        if(!message.member.hasPermission("MANAGE_GUILD")) return message.delete();

        const verifyEmbed = new Discord.MessageEmbed()
        .setColor('0xF4C7FE')
        .setDescription(`Sup, welcome to __${message.guild.name}__. Right now you have to verify\nyourself to gain access in the\nvoice and text channels.\nTo verify click the button bellow which says \`Verify\`.\nThen you'll be verified and enjoy your stay in the server.`)
        .setAuthor('Verification System', bot.user.displayAvatarURL())

        const verifyButton = new MessageButton()
        .setLabel('Verify')
        .setStyle('blurple')
        .setID('verify')

        message.delete();
        message.channel.send(verifyEmbed, verifyButton)

        bot.on("clickButton", async button => {
            const clicker = button.clicker.member;

            if(button.id === 'verify') {
                button.reply.send('Welcome, plz gimme a sec', true)
                setTimeout(() => {
                    clicker.roles.remove('888732509066629160')
                    clicker.roles.add('888736820718870549').then(
                        verifySchema.findOne({ guildID: message.guild.id, userID: clicker.id }, async (err, data) => {
                            if(!data) {
                                new verifySchema({
                                    guildID: message.guild.id,
                                    userID: clicker.id
                                }).save();
                            }
                        })
                    )
                }, ms('1s'))
            }
        })
    }
}