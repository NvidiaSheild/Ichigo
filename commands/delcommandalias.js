let settings = require('../settings')
let database = require('../handlers/database')
let discord = require('discord.js')


exports.run = (client, msg, args, server_settings) => {
    if(!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send("You do not have permission to do that.")
    if (!args[0]) return msg.channel.send("Please give a command alias to remove")
    if (!server_settings.commandaliases) {
        return msg.channel.send("That command alias doesn't exist");
    }
    let com_name = args[0];
    let commandaliases = server_settings.commandaliases;
    if (!commandaliases[com_name]) {
        return msg.channel.send("That command alias doesn't exist");
    }
    delete commandaliases[com_name]
    database.updateServer(msg.guild.id, {
        "commandaliases": commandaliases
    }).then(data => {
        return msg.channel.send(`Command alias \`${com_name}\` removed`)
    }).catch(e => {
        return msg.channel.send(`There was an error:\n\`\`\`${e}\`\`\`\nPlease take this to the author.`)
    })
}

exports.info = {
    "name": "delcommandalias",
    "type": "admin",
    "description": "remove a command alias from this guild",
    "example": "delcommandalias",
    "votelocked": true
}