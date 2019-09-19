
exports.run = (client, msg, server_settings) => {
    if(!msg.guild.member(client.user.id).permissions.has("BAN_MEMBERS")) return msg.channel.send("I don't have permission to do this.");
    if(!msg.guild.member(msg.author.id).permissions.has("BAN_MEMBERS")) return msg.channel.send("You don't have permission to do this.");
    if(!args) return msg.channel.send("Please provide a user.");
    id_to_ban = args[0].replace("/[<@!>]/g", "")
    reason = args.splice(1).join(" ")
    msg.guild.ban(id_to_ban, {reason: reason}).then(user => {
        return msg.channel.send(`User \`${user.tag}\` banned for: \` ${reason} \``)
    }).catch(e => {
        return msg.channel.send(`User not found`)
    })
    
}

exports.info = {
    "name": "ban",
    "description": "ban a user from your server",
    "type": "moderator",
    "example": "ban [user] [reason]"
}