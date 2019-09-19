const discord = require('discord.js')

exports.run = (client, msg, args, server_settings) => {
    if(!msg.guild.member(client.user.id).permissions.has("KICK_MEMBERS")) return msg.channel.send("I don't have permission to do this.");
    if(!msg.guild.member(msg.author.id).permissions.has("KICK_MEMBERS")) return msg.channel.send("You don't have permission to do this.");
    if(!args) return msg.channel.send("Please provide a user.");
    id_to_kick = args[0].replace("/[<@!>]/g", "")
    reason = args.splice(1).join(" ") | `Kicked by ${msg.author.tag}`
    msg.guild.fetchMember(id_to_kick).then(member => {
        member.kick(reason).then(user => {
            return msg.channel.send(`User \`${user.tag}\` kicked for: \`${reason}\``)
        }).catch(e => {
            if (e.message == "Missing Permissions") {
                return msg.channel.send(`I could not kick that users.\nIs that user higher or the same in permissions?`)
            } else {
                return msg.channel.send(`There was an error process your command please report this to the support server.`)
            }
        })
    }).catch(() => {
        return msg.channel.send("User not found.")
    })
    
}

exports.info = {
    "name": "kick",
    "description": "kick a user from your server",
    "type": "moderator",
    "example": "kick [user] [reason]"
}