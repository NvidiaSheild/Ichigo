let settings = require('../settings')
let database = require('../handlers/database')
let discord = require('discord.js')

exports.run = (client, msg, args, server_settings) => {
    if(!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send("You do not have permission to do that.")
    if (!args[0]) return msg.channel.send("Please give a command to edit")
    if (!args[1]) return msg.channel.send("Please give a new command output")
    if (!server_settings.customcommands) {
        return msg.channel.send("That command doesn't exists, use the `addcustomcommand` instead");
    }
    let customcommands = server_settings.customcommands;
    let com_name = args[0];
    if (!customcommands[com_name]) {
        return msg.channel.send("That command doesn't exists, use the `addcustomcommand` instead");
    }
    let com_output = args.splice(1).join(" ");
    customcommands[com_name] = com_output;
    database.updateServer(msg.guild.id, {
        "customcommands": customcommands
    }).then(data => {
        return msg.channel.send(`Custom command \`${com_name}\` updated with output: \`${com_output}\``)
    }).catch(e => {
        return msg.channel.send(`There was an error:\n\`\`\`${e}\`\`\`\nPlease take this to the author.`)
    })
}


exports.info = {
    "name": "editcustomcommand",
    "type": "admin",
    "description": "edit a custom command on this guild",
    "example": "editcustomcommand [command name] [new output]",
    "votelocked": true
}