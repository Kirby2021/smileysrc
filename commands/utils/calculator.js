const Discord = require('discord.js');
const Disbut = require('discord-buttons');
const math = require('mathjs');

module.exports = {
    name: 'calculator',
    aliases: ['calculate', 'calc'],

    async run (bot, message, args) {
			if(message.channel.id !== '891686229979062323') return message.lineReply('Wrong channel b r u h');
			
        let button = new Array([], [], [], [], []);
        let row = [];
        let text = ["clear", "(", ")", "/", "7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+", ".", "0", "00", "="];
        let current = 0;

        for(let i = 0; i < text.length; i++) {
            if(button[current].length === 4) current++;
            button[current].push(createButton(text[i]));
            if(i === text.length - 1) {
                for(let btn of button) row.push(addRow(btn));
            }
        }


        const calculator = new Discord.MessageEmbed()
        .setColor("BLURPLE")
        .setDescription("```0                           ```")

        message.channel.send({
            embed: calculator,
            components: row
        }).then((msg) => {

            let isWrong = false;
            let time = 300000;
            let value = "";
            let randomEmbed = new Discord.MessageEmbed()
            .setColor("BLURPLE")

            function createCollector(val, result = false) {
                let filter = (buttons1) => buttons1.clicker.user.id === message.author.id && buttons1.id === "cal" + val;
                let collect = msg.createButtonCollector(filter, { time: time });

                collect.on("collect", async x => {
                    x.reply.defer();

                    if(result === "new") value = "0"
                    else if(isWrong) {
                        value = val
                        isWrong = false;
                    }
                    else if(result === "0") value = val;
                    else if(result) {
                        isWrong = true;
                        value = mathEval(value);
                    }
                    else value += val

                    randomEmbed.setDescription("```" + value + '                            ' +"```")
                    msg.edit({
                        embed: randomEmbed,
                        components: row
                    })
                })
            }

            for(let txt of text) {
                let result;
                if(txt === "clear") result = "new";
                else if(txt === "=") result = true;
                else result = false

                createCollector(txt, result)
            }

            setTimeout(() => {
                randomEmbed.setDescription(`Time's up, you had 5 minutes.`)
                randomEmbed.setColor("RED")
                msg.edit({
                    embed: randomEmbed
                })
            }, time)
        })



        function addRow(btns) {
            let row1 = new Disbut.MessageActionRow()
            for(let btn of btns) {
                row1.addComponent(btn);
            }
            return row1;
        }

        function createButton(label, style = "grey") {
            if(label === "clear") style = "red"
            else if(label === ".") style = "grey"
            else if(label === "=") style = "green"
            else if(isNaN(label)) style = "blurple"

            const btn = new Disbut.MessageButton()
            .setLabel(label)
            .setStyle(style)
            .setID("cal" + label)
            return btn;
        }

        function mathEval(input) {
            try {
                let res = math.evaluate(input)
                return res
              } catch {
                return "Wrong input !"
              }
        }
    }
}