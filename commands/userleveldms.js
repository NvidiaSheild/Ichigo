let database = require('../handlers/database');

exports.run = (client, msg, args, server_settings) => {
    database.get_user(msg.author.id).then(user_settings => {
        if (user_settings.leveldms == undefined) {
            database.update_user(msg.author.id, {
                "leveldms": false
            })
            msg.channel.send("I wont dm you when you level up.\nYou can toggle this again by using the `userleveldms` command")
        }
        else if (user_settings.leveldms == false) {
            database.update_user(msg.author.id, {
                "leveldms": true
            })
            msg.channel.send("I will now dm you when they level up.\nYou can toggle this again by using the `userleveldms` command")
        } else if (user_settings.leveldms == true) {
            database.update_user(msg.author.id, {
                "leveldms": false
            })
            msg.channel.send("I wont dm you when you level up.\nYou can toggle this again by using the `userleveldms` command")
        }
    })
}

exports.info = {
    "name": "userleveldms",
    "description": "toggle the dm message for levelling up [PER USER]",
    "type": "basic",
    "example": "userleveldms"
}