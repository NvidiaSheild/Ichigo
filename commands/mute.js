
exports.run = (client, msg, args, server_settings) => {
    if(!msg.guild.member(client.user.id).permissions.has("MANAGE_ROLES")) return msg.channel.send("I don't have permission to do this.");
    if(!msg.guild.member(msg.author.id).permissions.has("MANAGE_ROLES")) return msg.channel.send("You don't have permission to do this.");
    let id_to_mute = args[0].replace(/[<@!>]/g, "")
    let reason = args.splice(1).join(" ")
    if (reason == "") {
        reason = `Muted by ${msg.author.tag}`
    }
    msg.guild.fetchMember(id_to_mute).then(member => {
        if(!msg.guild.roles.map(r => r.name.toLowerCase()).includes("muted")) return msg.channel.send("You do not have a role named `Muted`");
        if(member.roles.find(role => role.name.toLowerCase() == "muted")) return msg.channel.send("User is already muted");
        role = msg.guild.roles.find(role => role.name.toLowerCase() == "muted");
        msg.member.addRole(role, reason).then(user => {
            return msg.channel.send(`User ${user.user.tag} has been muted for: ${reason}`)
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
    "name": "mute",
    "description": "mute a user",
    "type": "moderator",
    "example": "mute [user] [reason]"
}