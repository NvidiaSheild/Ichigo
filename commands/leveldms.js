let database = require('../handlers/database');

exports.run = (client, msg, args, server_settings) => {
    if (!msg.guild.member(msg.author.id).permissions.has("MANAGE_GUILD")) return msg.channel.send("You don't have permission to do this.");
    database.getServer(msg.guild.id).then(server => {
        let server_settings = JSON.parse(server)
        let leveldmstoggle = server_settings.leveldms
        if (leveldmstoggle == undefined) {
            database.updateServer(msg.guild.id, {
                "leveldms": false
            })
            msg.channel.send("I wont dm a user when they level up.\nThey can toggle this themselves by using the `userleveldms` command")
        }
        else if (leveldmstoggle == false) {
            database.updateServer(msg.guild.id, {
                "leveldms": true
            })
            msg.channel.send("I will now dm a user when they level up.\nThey can toggle this themselves by using the `userleveldms` command")
        } else if (leveldmstoggle == true) {
            database.updateServer(msg.guild.id, {
                "leveldms": false
            })
            msg.channel.send("I wont dm a user when they level up.\nThey can toggle this themselves by using the `userleveldms` command")
        }
    })
}

exports.info = {
    "name": "leveldms",
    "description": "toggle the dm message for levelling up [PER GUILD]",
    "type": "moderator",
    "example": "leveldms"
}