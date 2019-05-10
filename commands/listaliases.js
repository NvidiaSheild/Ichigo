let settings = require('../settings')
let database = require('../handlers/database')
let discord = require('discord.js')

exports.run = (client, msg, args, server_settings) => {
    if(!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send("You do not have permission to do that.")
    if (!server_settings.commandaliases) return msg.channel.send("There are no command aliases on this guild.");
    let commands = Object.keys(server_settings.commandaliases)
    if(!commands || commands.length == 0) {
        return msg.channel.send("There are no command aliases on this guild.")
    } else {
        allcommands = Object.keys(server_settings.commandaliases).join("\n")
        return msg.channel.send("Currently available command aliases:\n```" + allcommands + "```", {split: true})
    }
}


exports.info = {
    "name": "listaliases",
    "type": "basic",
    "description": "list all command aliases for the guild.",
    "example": "listaliases",
    "votelocked": true
}