let database = require('../handlers/database');

exports.run = (client, msg, args, server_settings) => {
    msg.channel.send("Toggling...").then(message => {
        setTimeout(() => {
            database.get_user(msg.author.id).then(user_settings => {
                console.log(user_settings.leveldms);
                if (user_settings.leveldms == true) {
                    database.update_user(msg.author.id, {
                        leveldms: false
                    })
                    message.edit("I wont dm you when you level up.\nYou can toggle this again by using the `userleveldms` command")
                } else if (user_settings.leveldms == false) {
                    database.update_user(msg.author.id, {
                        leveldms: true
                    })
                    message.edit("I will now dm you when you level up.\nYou can toggle this again by using the `userleveldms` command")
                } else if (user_settings.leveldms == undefined) {
                    database.update_user(msg.author.id, {
                        leveldms: false
                    })
                    message.edit("I wont dm you when you level up.\nYou can toggle this again by using the `userleveldms` command")
                }
            })
        }, 150)
    })
}

exports.info = {
    "name": "userleveldms",
    "description": "toggle the dm message for levelling up [PER USER]",
    "type": "basic",
    "example": "userleveldms"
}