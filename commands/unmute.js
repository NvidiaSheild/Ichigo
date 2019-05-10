
exports.run = (client, msg, args, server_settings) => {
    if(!msg.guild.member(client.user.id).permissions.has("MANAGE_MEMBERS")) return msg.channel.send("I don't have permission to do this.");
    if(!msg.guild.member(msg.author.id).permissions.has("MANAGE_MEMBERS")) return msg.channel.send("You don't have permission to do this.");
    id_to_unmute = msg.content.replace("/ +/g", " ").split(" ").splice(2)[0].replace("/[<@!>]/g", "")
    msg.guild.fetchMember(id_to_unmute).then(member => {
        if(!msg.guild.roles.map(r => r.name.toLowerCase()).includes("muted")) return msg.channel.send("You do not have a role named `Muted`");
        if(!member.roles.find(role => role.name.toLowerCase() == "muted")) return msg.channel.send("User is not muted");
        role = msg.guild.roles.find(role => role.name.toLowerCase() == "muted");
        msg.member.removeRole(role, reason).then(user => {
            return msg.channel.send(`User ${user.tag} has been unmuted`)
        }).catch(e => {
            if(e.message == "Missing Permissions") {
                return msg.channel.send(`I can not mute that person as I lack the permission to do so.\nIs the user higher or the same permission as me?`)
            } else {
                return msg.channel.send(`An error has occured please go to the support guild.`)
            }
        })
    }).catch(() => {
        return msg.channel.send("User not found.")
    })
}

exports.info = {
    "name": "unmute",
    "description": "unmute a user",
    "type": "moderator",
    "example": "unmute [user]"
}