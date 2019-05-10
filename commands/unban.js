
exports.run = (client, msg, server_settings) => {
    if(!msg.guild.member(client.user.id).permissions.has("BAN_MEMBERS")) return msg.channel.send("I don't have permission to do this.");
    if(!msg.member.permissions.has("BAN_MEMBERS")) return msg.channel.send("You don't have permission to do this.");
    id_to_ban = args[0].replace("/[<@!>]/g", "")
    msg.guild.ban(id_to_ban).then(user => {
        return msg.channel.send(`User \`${user.tag}\` unbanned.`)
    }).catch(e => {
        return msg.channel.send(`User not found`)
    })
    
}

exports.info = {
    "name": "unban",
    "description": "unban a user from your server",
    "type": "moderator",
    "example": "unban [user]"
}