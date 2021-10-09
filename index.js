const Discord = require('discord.js');
require('discord-inline-reply');
const bot = new Discord.Client({
	disableMentio: "everyone",
	shards: "auto",
	restTimeOffset: false
});

require('discord-buttons')(bot);

const config = require('./config.json');

const mongoose = require('mongoose');

mongoose.connect(config.mongodb, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, }).then(console.log('Connected to MongoDB.'));

const { readdirSync, read } = require('fs');
const ms = require('ms');

const prefixSchema = require('./models/prefixSchema');
const blackListServerSchema = require('./models/blackListServerSchema');
const toggleCommandSchema = require('./models/toggleCommandSchema');

require('./utils/eventHandler')(bot);

bot.editsnipes = new Discord.Collection();
bot.snipes = new Discord.Collection();
bot.commands = new Discord.Collection();
const commandFolders = readdirSync('./commands');
const Timeout = new Discord.Collection();


//------------------------------------------------------------

for (const folder of commandFolders) {
    const commandFiles = readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        bot.commands.set(command.name, command)
    }
}

bot.on("error", console.error);

//-----------------------------------------------------------------------------------------

const db = require('quick.db');

const developerID = config.developerID;

bot.on('message', async (message) => {
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;

    let prefix;
    let data = await prefixSchema.findOne({
        guildID: message.guild.id,
    })
    if(data === null) {
        prefix = config.prefix;
    } else {
        prefix = data.prefix
    }

    const blacklistSchema = require('./models/blacklistSchema');

    if(message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);

        const commandName = args.shift().toLowerCase();

        const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if(!command) return;
        if(command.devOnly == true && message.author.id !== developerID) return message.delete();

        let dataBlacklist = await blacklistSchema.findOne({
            userID: message.author.id,
        });

        if (command) {
            if(message.member.roles.cache.has('888732509066629160')) return;
            if(dataBlacklist) return message.lineReply(`You can't use my commands lmao`);
            const blacklistedServer = await blackListServerSchema.findOne({ guildID: message.guild.id });
            if(blacklistedServer) return message.lineReply('This server is blacklisted which means that no one in this server can use my commands.');

            const dataCmd = await toggleCommandSchema.findOne({ guildID: message.guild.id, command: command.name });
            if(dataCmd) return;

            if(command.cooldown) {
                if(Timeout.has(`${command.name}${message.author.id}`)) return message.reply(`Pls wait ${ms(Timeout.get(`${command.name}${message.author.id}`) - Date.now(), { long: true })} before using this command.`);
                command.run(bot, message, args)
                Timeout.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown)
                setTimeout(() => {
                    Timeout.delete(`${command.name}${message.author.id}`)
                }, command.cooldown)
            } else command.run(bot, message, args);
        }
    }
})

//--------------------------------------------------------------------------------------------

bot.login(config.token);