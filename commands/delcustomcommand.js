let settings = require('../settings')
let database = require('../handlers/database')
let discord = require('discord.js')


exports.run = (client, msg, args, server_settings) => {
    if(!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send("You do not have permission to do that.")
    if (!args[0]) return msg.channel.send("Please give a command to remove")
    if (!server_settings.customcommands) {
        return msg.channel.send("That command doesn't exists, use the `addcustomcommand` instead");
    }
    let com_name = args[0];
    let customcommands = server_settings.customcommands;
    if (!customcommands[com_name]) {
        return msg.channel.send("That command doesn't exists, use the `addcustomcommand` instead");
    }
    delete customcommands[com_name]
    database.updateServer(msg.guild.id, {
        "customcommands": customcommands
    }).then(data => {
        return msg.channel.send(`Custom command \`${com_name}\` removed`)
    }).catch(e => {
        return msg.channel.send(`There was an error:\n\`\`\`${e}\`\`\`\nPlease take this to the author.`)
    })
}

exports.info = {
    "name": "delcustomcommand",
    "type": "admin",
    "description": "remove a custom command from this guild",
    "example": "editcustomcommand [command name]",
    "votelocked": true
}