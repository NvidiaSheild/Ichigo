let settings = require('../settings')
let database = require('../handlers/database')
let discord = require('discord.js')

exports.run = (client, msg, args, server_settings) => {
    if(!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send("You do not have permission to do that.")
    if (!args[0]) return msg.channel.send("Please give a command to add")
    if (!args[1]) return msg.channel.send("Please give a command output ")
    let customcommands;
    if (!server_settings.customcommands) {
        customcommands = {}
    } else {
        customcommands = server_settings.customcommands
    }
    let com_name = args[0];
    if (customcommands[com_name]) {
        return msg.channel.send("That command already exists, use the `editcustomcommand` instead");
    }
    let com_output = args.splice(1).join(" ");
    customcommands[com_name] = com_output;
    database.updateServer(msg.guild.id, {
        "customcommands": customcommands
    }).then(data => {
        return msg.channel.send(`Custom command \`${com_name}\` created with output: \`${com_output}\``)
    }).catch(e => {
        return msg.channel.send(`There was an error:\n\`\`\`${e}\`\`\`\nPlease take this to the author.`)
    })
}


exports.info = {
    "name": "addcustomcommand",
    "type": "admin",
    "description": "add a custom command for this guild",
    "example": "addcustomcommand [command name] [output]",
    "votelocked": true
}