const prefixSchema = require('../../models/prefixSchema');
const prefix = require('../../config.json').prefix;

module.exports = {
    name: 'setprefix',
    aliases: ['prefix'],
    description: 'Set a custom prefix for your server.',

    async run (bot, message, args) {
        if(!message.member.hasPermission('MANAGE_GUILD')) return message.delete();

        const newPrefix = args[0];
        if(!newPrefix) return message.lineReply('provide a prefix bruh');
        if(newPrefix.length > 3) return message.lineReply('That prefix is too long. The maximum characters is 3 characters.');
        if(!isNaN(newPrefix)) return message.lineReply('Numbers??');
        if(newPrefix === prefix) return message.lineReply(`If you want to set the prefix to the default one use the \`resetprefix\` command.`)
        
        let data;

        try {
            data = await prefixSchema.findOne({
                guildID: message.guild.id
            })
            if(!data) {
                let newData = await prefixSchema.create({
                    guildName: message.guild.name,
                    guildID: message.guild.id,
                    prefix: newPrefix,
                })
                newData.save();
            } else {
                await prefixSchema.findOneAndUpdate({
                    guildID: message.guild.id,
                    prefix: newPrefix,
                })
            }
            message.channel.send(`Prefix set to **${newPrefix}**`)
        } catch(err) {
            console.log(err)
        }
    }
}