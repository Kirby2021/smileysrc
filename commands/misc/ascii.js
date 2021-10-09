const figlet = require('figlet');

module.exports = {
    name: 'ascii',
    cooldown: 1000 * 5,
    description: 'Do an ascii art.',

    async run (bot, message, args) {
        if(message.channel.id !== '891686229979062323') return message.lineReply('Wrong channel lmao');

        if(!args.join(" ")) return message.lineReply('Provide a text bruh');

        figlet.text(args.join(" "), {
            font: "",
        }, async (err, data) => {
            message.channel.send(`\`\`\`${data}\`\`\``)
        });
    }
}