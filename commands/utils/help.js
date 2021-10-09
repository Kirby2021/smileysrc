const Discord = require('discord.js');
const { MessageActionRow, MessageMenu, MessageMenuOption } = require('discord-buttons');
const { developerID } = require('../../config.json');
const fetch = require('node-fetch');

module.exports = {
    name: 'help',
    aliases: ['halp'],
    description: 'Get help to get information about the commands.',

    async run (bot, message, args) {
		if(message.channel.id !== '891686229979062323') return message.lineReply('Can you go to <#891686229979062323> please?');
			
        const category = args.splice(0).join(" ");

        const dev = new MessageMenuOption()
        .setLabel('developer commands')
        .setDescription('Click to get info about developer commands')
        .setEmoji('868797632296927282')
        .setValue('dev')
 
        const fun = new MessageMenuOption()
        .setLabel('fun')
        .setDescription('Click to get info about fun commands')
        .setEmoji('850767631597830165')
        .setValue('fun')

        const info = new MessageMenuOption()
        .setLabel('info')
        .setDescription('Click to get info about info commands')
        .setEmoji('868802011833974794')
        .setValue('info')
 
        const misc = new MessageMenuOption()
        .setLabel('misc')
        .setDescription('Click to get info about misc commands')
        .setEmoji('876855895999512626')
        .setValue('misc')
 
        const mod = new MessageMenuOption()
        .setLabel('moderation')
        .setDescription('Click to get info about moderation commands')
        .setEmoji('868797362234089492')
        .setValue('mod')

        const search = new MessageMenuOption()
        .setLabel('search')
        .setDescription('Click to get info about search commands')
        .setEmoji('🔍')
        .setValue('search')

        const config = new MessageMenuOption()
        .setLabel('config')
        .setDescription('Click to get info about config commands')
        .setEmoji('868805364697690172')
        .setValue('config')
 
        const utils = new MessageMenuOption()
        .setLabel('utilities')
        .setDescription('Click to get info about utilities commands')
        .setEmoji('868824424231624735')
        .setValue('utils')

        const ytt = new MessageMenuOption()
        .setLabel('YouTube Together Activity')
        .setDescription('Click to get the link for a YouTube Together Avtivity')
        .setEmoji('882265613312098394')
        .setValue('ytt')
 
        const menu = new MessageMenu()
        .setID('help')
        .setPlaceholder('Click to select a section')
        .addOption(dev)
        .addOption(fun)
        .addOption(info)
        .addOption(misc)
        .addOption(mod)
        .addOption(search)
        .addOption(config)
        .addOption(utils)
        .addOption(ytt)

        const helpRow = new MessageActionRow()
        .addComponent(menu)

        if(!category) {
            message.channel.send('https://cdn.discordapp.com/attachments/848559419532378112/881496635060916255/PicsArt_08-29-01.12.37.jpg', { components: [helpRow] });

            bot.on('clickMenu', async menu => {
                const member = menu.clicker.member;
                
                if(menu.values[0] === 'dev') {
                    if(member.id !== developerID) return menu.reply.send('That section is only allowed for the *developer*.', true);
    
                    menu.reply.send(
                        new Discord.MessageEmbed()
                        .setColor('RANDOM')
                        .setTitle('Developer commands')
                        .setDescription('\`blacklist\` | \`blacklistserver\` | \`eval\` | \`unblacklist\` | \`unblacklistserver\` | \`leaveserver\`')
                    , true)
                }
    
                if(menu.values[0] === 'fun') {
                    menu.reply.send(
                        new Discord.MessageEmbed()
                        .setColor('RANDOM')
                        .setTitle('Fun commands')
                        .setDescription('\`8ball\` | \`beg\` | \`clyde\` | \`freebobux\` | \`gayrate\` | \`meme\` | \`ship\` | \`simprate\` | \`urmom\` | \`xd\` | \`halalrate\`')
                    , true)
                }
    
                if(menu.values[0] === 'misc') {
                    menu.reply.send(
                        new Discord.MessageEmbed()
                        .setColor('RANDOM')
                        .setTitle('Misc commands')
                        .setDescription('\`ascii\` | \`avatar\` | \`banner\`')
                    , true)
                }
    
                if(menu.values[0] === 'mod') {
                    menu.reply.send(
                        new Discord.MessageEmbed()
                        .setColor('RANDOM')
                        .setTitle('Moderation commands')
                        .setDescription('\`automodwarninfo\` | \`ban\` | \`clear-all-warns\` | \`clear-automod-warn\` | \`clear-automod-warns\` | \`clear\` | \`clearwarn\` | \`kick\` | \`lock\` | \`moderate\` | \`mute\` | \`nick\` | \`resetnick\` | \`set-level\` | \`set-xp\` | \`slowmode\` | \`tempban\` | \`tempmute\` | \`unban\` | \`unlock\` | \`unmute\` | \`warn\` | \`warninfo\`')
                        .addField('Shortcuts (warn)', '\`spam\` | \`bypass\`')
                        .addField('Shortcuts', '\`underage\` | \`racism\`')
                    , true)
                }
    
                if(menu.values[0] === 'config') {
                    menu.reply.send(
                        new Discord.MessageEmbed()
                        .setColor('RANDOM')
                        .setTitle('Config commands')
                        .setDescription('\`altdetection\` | \`automodtoggle\` | \`disable\` | \`enable\` | \`leveltoggle\` | \`sendverify\` | \`setprefix\` | \`resetprefix\`')
                    , true)
                }
    
                if(menu.values[0] === 'utils') {
                    menu.reply.send(
                        new Discord.MessageEmbed()
                        .setColor('RANDOM')
                        .setTitle('Utilities commands')
                        .setDescription('\`addemoji\` | \`afk\` | \`automod\` | \`calculator\` | \`editsnipe\` | \`ping\` | \`snipe\` | \`warnings\` | \`pingroles\`')
                    , true)
                }
    
                if(menu.values[0] === 'ytt') {
                    const vc = message.member.voice.channel;
                    if(!vc) return menu.reply.send('You gotta be in a voice channel.', true);
            
                    fetch(`https://discord.com/api/v8/channels/${vc.id}/invites`, {
                        method: "POST",
                        body: JSON.stringify({
                            max_age: 0,
                            max_uses: 0,
                            target_application_id: "755600276941176913",
                            target_type: 2,
                            temporary: false,
                            validate: null
                        }),
                        headers: {
                            "Authorization": `Bot ${bot.token}`,
                            "Content-type": "application/json"
                        }
                    }).then(res => res.json()).then(invite => {
                        if(!invite.code) return menu.reply.send(`Well, it seems like I can't start a YouTube together right now.`, true);
                        menu.reply.send(`To start a YouTube Together click right [here](<https://discord.com/invite/${invite.code}> "Start a YouTube Together Activity").`, true);
                    })
                }
    
                if(menu.values[0] === 'info') {
                    menu.reply.send(
                        new Discord.MessageEmbed()
                        .setColor('RANDOM')
                        .setTitle('Info commands')
                        .setDescription('\`leaderboard\` | \`rank\` | \`servercount\` | \`serverinfo\` | \`weather\` | \`whois\`')
                    , true)
                }
    
                if(menu.values[0] === 'search') {
                    menu.reply.send(
                        new Discord.MessageEmbed()
                        .setColor('RANDOM')
                        .setTitle('Search commands')
                        .setDescription('\`npm\` | \`wikipedia\`')
                    , true)
                }
            })
        } else if(category === 'mod' || category === 'moderation') {
            message.lineReplyNoMention(
                new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Moderation commands')
                .setDescription('\`automodwarninfo\` | \`ban\` | \`clear-automod-warn\` | \`clear\` | \`clearwarn\` | \`kick\` | \`lock\` | \`moderate\` | \`mute\` | \`nick\` | \`resetnick\` | \`setlevel\` | \`setxp\` | \`slowmode\` | \`tempban\` | \`tempmute\` | \`unban\` | \`unlock\` | \`unmute\` | \`warn\` | \`warninfo\` | \`spam\` | \`bypass\` | \`racism\` | \`underage\`')
            )
        } else if(category === 'dev' || category === 'developer commands' || category === 'developer') {
            if(message.author.id !== developerID) return message.lineReply('That section is only allowed for the *developer*.');

            try {
                message.author.send(
                    new Discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle('Developer commands')
                    .setDescription('\`blacklist\` | \`blacklistserver\` | \`eval\` | \`unblacklist\` | \`unblacklistserver\` | \`leaveserver\`')
                )
            } catch(err) {
                console.log(err)
                return message.lineReply('Open your DMs pls, or just select the option with the menu.')
            }
        } else if(category === 'fun' || category === 'funne' || category === 'funny') {
            message.lineReplyNoMention(
                new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Fun commands')
                .setDescription('\`8ball\` | \`beg\` | \`clyde\` | \`freebobux\` | \`gayrate\` | \`meme\` | \`ship\` | \`simprate\` | \`urmom\` | \`xd\` | \`halalrate\`')
            )
        } else if(category === 'info' || category === 'information') {
            message.lineReplyNoMention(
                new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Info commands')
                .setDescription('\`leaderboard\` | \`rank\` | \`servercount\` | \`serverinfo\` | \`weather\` | \`whois\`')
            )
        } else if(category === 'search') {
            message.lineReplyNoMention(
                new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Search commands')
                .setDescription('\`npm\` | \`wikipedia\`')
            )
        } else if(category === 'utils' || category === 'utilities') {
            message.lineReplyNoMention(
                new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Utilities commands')
                .setDescription('\`addemoji\` | \`afk\` | \`automod\` | \`calculator\` | \`editsnipe\` | \`ping\` | \`snipe\` | \`warnings\` | \`pingroles\`')
            )
        } else if(category === 'config' || category === 'configuration' || category === 'settings') {
            message.lineReplyNoMention(
                new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Utilities commands')
                .setDescription('\`addemoji\` | \`afk\` | \`automod\` | \`calculator\` | \`editsnipe\` | \`ping\` | \`snipe\` | \`warnings\` | \`pingroles\`')
            )
        } else if(category === 'misc') {
            message.lineReplyNoMention(
                new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Misc commands')
                .setDescription('\`ascii\` | \`avatar\` | \`banner\`')
            )
        }
    }
}