let settings = require('../settings')
let database = require('../handlers/database')
let discord = require('discord.js')

exports.run = (client, msg, args, server_settings) => {
    if(!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send("You do not have permission to do that.")
    if (!args[0]) return msg.channel.send("Please give a command to make an alias for")
    if (!args[1]) return msg.channel.send("Please give an alias name")
    let commandaliases;
    if (!server_settings.commandaliases) {
        commandaliases = {}
    } else {
        commandaliases = server_settings.commandaliases
    }
    let com_name = args[0];
    let alias_name = args[1]
    if (commandaliases[alias_name]) {
        return msg.channel.send("That command alias already exists");
    }
    commandaliases[alias_name] = com_name;
    database.updateServer(msg.guild.id, {
        "commandaliases": commandaliases
    }).then(data => {
        return msg.channel.send(`Command alias \`${alias_name}\` for the command: \`${com_name}\``)
    }).catch(e => {
        return msg.channel.send(`There was an error:\n\`\`\`${e}\`\`\`\nPlease take this to the author.`)
    })
}


exports.info = {
    "name": "addcommandalias",
    "type": "admin",
    "description": "add a command alias for this guild",
    "example": "addcommandalias [command] [command alias]",
    "votelocked": true
}