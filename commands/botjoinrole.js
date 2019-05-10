let database = require('../handlers/database')

exports.run = (client, msg, args, server_settings) => {
    if(!msg.guild.member(client.user.id).permissions.has("MANAGE_ROLES")) return msg.channel.send("I don't have permission to do this.");
    if(!msg.member.hasPermission("MANAGE_ROLES")) return msg.channel.send("You do not have permission to do that.")
    role_to_set = args.join(" ")
    role = msg.guild.roles.find(role => role.id == args[0].replace(/[<@&>]/g, "") || role.name.toLowerCase() == role_to_set.toLowerCase())
    if(!role) {
        return msg.channel.send("Role not found")
    } else {
        database.updateServer(msg.guild.id, { "botjoinrole": `${role.id}` }).then(newdata => {
            return msg.channel.send(`Bot join role set to: \`${role.name} (${role.id})\``)
        })
    }
}



exports.info = {
    "name": "botjoinrole",
    "description": "the role bots will receive upon join your server.",
    "example": "botjoinrole [role name / role id]",
    "type": "admin"
}