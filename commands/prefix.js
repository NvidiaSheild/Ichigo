let database = require('../handlers/database')

exports.run = (client, msg, args, server_settings) => {
    if(!msg.member.permissions.has("MANAGE_MESSAGES") || !args[0]) return msg.channel.send("Current Prefix: `" + server_settings.prefix + "`");
    let new_prefix = args.join(" ")
    database.updateServer(msg.guild.id, {
        "prefix": new_prefix
    }).then(data => {
        return msg.channel.send(`Prefix updated to: \`${data.prefix}\``)
    }).catch(err => {
        return msg.channel.send(`There was an error:\n\`\`\`xl\n${err}\`\`\`\nPlease go to the support guild and tell the author`)
    })

}

exports.info = {
    "name": "prefix",
    "description": "get the current prefix, or change it to a new one",
    "example": "prefix\nprefix [new prefix]",
    "type": "admin"
}