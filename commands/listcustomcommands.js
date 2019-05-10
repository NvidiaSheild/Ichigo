let settings = require('../settings')
let database = require('../handlers/database')
let discord = require('discord.js')

exports.run = (client, msg, args, server_settings) => {
    if(!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send("You do not have permission to do that.")
    if (!server_settings.customcommands) return msg.channel.send("There are no custom commands on this guild.");
    let commands = Object.keys(server_settings.customcommands)
    if(!commands || commands.length == 0) {
        return msg.channel.send("There are no custom commands on this guild.")
    } else {
        allcommands = Object.keys(server_settings.customcommands).join("\n")
        return msg.channel.send("Currently available custom commands:\n```" + allcommands + "```", {split: true})
    }
}


exports.info = {
    "name": "listcustomcommands",
    "type": "basic",
    "description": "list all customcommands for the guild.",
    "example": "listcustomcommands",
    "votelocked": true
}