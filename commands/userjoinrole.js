let database = require('../handlers/database')

exports.run = (client, msg, args, server_settings) => {
    if(!msg.guild.member(client.user.id).permissions.has("MANAGE_ROLES")) return msg.channel.send("You don't have permission to do this.");
    if(!msg.member.hasPermission("MANAGE_ROLES")) return msg.channel.send("You do not have permission to do that.")
    role_to_set = args.join(" ")
    role = msg.guild.roles.find(role => role.id == args[0].replace(/[<@&>]/g, "") || role.name.toLowerCase() == role_to_set.toLowerCase())
    if(!role) {
        return msg.channel.send("Role not found")
    } else {
        database.updateServer(msg.guild.id, { "userjoinrole": `${role.id}` }).then(newdata => {
            return msg.channel.send(`User join role set to: \`${role.name} (${role.id})\``)
        })
    }
}



exports.info = {
    "name": "userjoinrole",
    "description": "the role users will receive upon join your server.",
    "example": "userjoinrole [role name / role id]",
    "type": "admin"
}