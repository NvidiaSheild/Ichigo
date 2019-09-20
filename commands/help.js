const fs = require('fs')
const MessageEmbed = require('discord.js').MessageEmbed

exports.run = (client, msg, args, server_settings) => {
    let help_catagory = args[0]
    if (!help_catagory) {
        msg.channel.send({
            embed: {
                title: "Available Categories:",
                description: `**Current Server Prefix:** \`${server_settings.prefix}\`
${server_settings.prefix} help basic
${server_settings.prefix} help moderator
${server_settings.prefix} help admin
${server_settings.prefix} help music`,
                color: 0x7289da
            }
        })
    } else {
        /* I don't even remember how the fuck I conjured this up */
        command_files = fs.readdirSync(`${process.cwd()}/commands/`).map(command => command.split(".")[0])
        if (command_files.includes(help_catagory)) {
            let cmd_info = require(`${process.cwd()}/commands/${help_catagory}.js`).info
            let embed = new MessageEmbed().addField("Command Name", cmd_info.name).addField("Command Decription", cmd_info.description).addField("Command Example", `\`\`\`${server_settings.prefix} ${cmd_info.example} \`\`\``)
            return msg.channel.send(embed)
        } else {
            let output = [];
            let commands_found = false;
            let cmd_text = command_files.map(command => {
                let cmd_info = require(`${process.cwd()}/commands/${command}`).info
                if (!cmd_info) return;
                if (cmd_info.type !== help_catagory) return;
                commands_found = true
                return `\`${cmd_info.name}\``
            });
            cmd_text.map(o => {if(o) output.push(o)})
            if(!commands_found) return msg.channel.send({
                embed: {
                    title: "Error",
                    description: "`There are no commands under that category.`"
                }
            })
            return msg.channel.send({
                embed: {
                    description: `**Current Server Prefix:**  \`${server_settings.prefix}\`\n**${help_catagory.capitalize()} commands:**\n ${output.join(", ")}`,
                    footer: {
                        text: `${server_settings.prefix} help <command> for more info`,
                    },
                    color: 0x7289da 
                }
            }).catch(console.log)
        }
    }

}

exports.info = {
    "name": "help",
    "type": "basic",
    "description": "get the available commands for the bot.",
    "example": "help [basic/moderator/admin]"
}
