let database = require('../handlers/database');

exports.run = (client, msg, args, server_settings) => {
    if(!msg.guild.member(client.user.id).permissions.has("KICK_MEMBERS")) return msg.channel.send("I don't have permission to do this.");
    if(!msg.guild.member(msg.author.id).permissions.has("KICK_MEMBERS")) return msg.channel.send("You don't have permission to do this.");
    database.getServer(msg.guild.id).then(server => {
        let server_settings = JSON.parse(server)
        let leveldmstoggle = server_settings.leveldms
        if(!leveldmstoggle) {
            database.updateServer(msg.guild.id, {
                leveldms: true
            })
            msg.channel.send("I will now dm a user when they level up.\nThey can toggle this themselves by using the `userlvldms` command")
        } else {
            database.updateServer(msg.guild.id, {
                leveldms: false
            })
            msg.channel.send("I wont dm a user when they level up.\nThey can toggle this themselves by using the `userlvldms` command")
        }
    })
}

exports.info = {
    "name": "leveldm",
    "description": "toggle the dm message for levelling up",
    "type": "moderator",
    "example": "leveldm"
}