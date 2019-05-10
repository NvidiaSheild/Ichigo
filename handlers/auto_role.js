let database = require('./database')

exports.handle = (is_bot, guild, guildMember, client) => {
    if (!guild.member(client.user.id).permissions.has("MANAGE_ROLES")) return;
    database.getServer(guild.id).then(server_settings => {
        server_settings = JSON.parse(server_settings)
        if (is_bot && server_settings.botjoinrole) {
            let role = guild.roles.find(role => role.id == server_settings.botjoinrole)
            guildMember.addRole(role, "Auto Role")
        } else if (!is_bot && server_settings.userjoinrole) {
            let role = guild.roles.find(role => role.id == server_settings.userjoinrole)
            guildMember.addRole(role, "Auto Role")
        }
    }).catch(e => { console.log })
}