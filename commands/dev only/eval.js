const { inspect } = require('util');
const Discord = require('discord.js');

module.exports = {
    name: 'eval',
    aliases: ['run', 'evaluate'],
    devOnly: true,
    description: 'Run a code with this command.',

    async run (bot, message, args) {
        const code = args.join(' ');
        if(!code) return message.lineReply('You gotta specify a code.');

        try {
            const result = await eval(code);
            let output = result;
            if(typeof result !== 'string') {
                output = inspect(result)
            }

            message.channel.send(output, { code: 'js' })
        } catch(err) {
            console.log(err)
            message.channel.send(
                new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle('Error!')
                .setDescription(`\`\`\`${err}\`\`\``)
                .setTimestamp()
            )
        }
    }
}