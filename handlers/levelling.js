let database = require('./database');
let RichEmbed = require('discord.js').RichEmbed;

let randomNum = (min, max) => { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}
exports.handle_global = (guild, user) => {
    database.get_user(user.id).then(_user_settings => {
        if (!_user_settings.level) {
            database.update_user(user.id, {
                level: 1,
                current_xp: 0,
                total_xp: 0,
                last_gained_xp: 0,
                username: user.username,
                discrim: user.discriminator,
                avatar: user.avatar
            })
        } else {
            let needed_xp = 256 * _user_settings.level;
            let user_xp = _user_settings.current_xp;
            let last_xp = _user_settings.last_gained_xp - Date.now();
            let xp_boost = _user_settings.xp_boost ? _user_settings.xp_boost : false;
            if (last_xp < -60000) {
                let xp_to_give;
                let level = _user_settings.level;
                let current_xp_total;
                let final_xp_total;
                if (xp_boost) {
                    xp_to_give = randomNum(16, 36)
                } else {
                    xp_to_give = randomNum(8, 24)
                }
                if ((user_xp + xp_to_give) > needed_xp) {
                    current_xp_total = (user_xp + xp_to_give) - needed_xp;
                    final_xp_total = _user_settings.total_xp + xp_to_give;
                    level++
                    database.getServer(guild.id).then(server => {
                        let server_data = JSON.parse(server)
                        if (server_data.leveldms == true && _user_settings.leveldms == undefined || server_data.leveldms == true && _user_settings.leveldms == true || server_data.leveldms == false && _user_settings.leveldms == true) {
                            let embed = new RichEmbed()
                            .setAuthor(`GLOBAL`)
                            .addField(`You Levelled up Globally!`, `You levelled up to level ${level}`)
                            .addField("Want to level up faster?", "[Consider Voting, You get a 12 hour XP boost](https://discordbots.org/bot/575977933492191232/vote)")
                            .addField("Don't want these messages?", `Run \`@Ichigo userleveldms\` in any server with me in it to disable it completely!`)
                            user.send({embed}).catch(e => {
                                console.log("Cant send DM to(" + user.name + ") [" + user.id + "]")
                            })
                        } else if ((server_data.leveldms == false && _user_settings.leveldms == undefined) || (server_data.leveldms == undefined && _user_settings.leveldms == false)) return; 
                        else return
                    })
                } else {
                    current_xp_total = user_xp + xp_to_give;
                    final_xp_total = _user_settings.total_xp + xp_to_give;
                }
                let time = Date.now();
                database.update_user(user.id, {
                    level: level,
                    current_xp: current_xp_total,
                    total_xp: final_xp_total,
                    last_gained_xp: time,
                    username: user.username,
                    discrim: user.discriminator,
                    avatar: user.avatar
                })
            }
        }
    })
}

exports.handle_guild = (msg, guild, user) => {
    database.get_user(user.id).then(_user_settings => {
        database.get_user_from_guild(user.id, guild.id).then(_user => {
            if (!_user.level) {
                database.edit_user_on_guild(user.id, guild.id, {
                    level: 1,
                    current_xp: 0,
                    total_xp: 0,
                    last_gained_xp: 0,
                    username: user.username,
                    discrim: user.discriminator,
                    avatar: user.avatar
                }).catch()
            } else {
                let needed_xp = 256 * _user.level;
                let user_xp = _user.current_xp;
                let last_xp = _user.last_gained_xp - Date.now();
                let xp_boost = _user.xp_boost ? _user.xp_boost : false;
                if (last_xp < -60000) {
                    let xp_to_give;
                    let level = _user.level;
                    let current_xp_total;
                    let final_xp_total;
                    if (xp_boost) {
                        xp_to_give = randomNum(16, 36)
                    } else {
                        xp_to_give = randomNum(8, 24)
                    }
                    if ((user_xp + xp_to_give) > needed_xp) {
                        current_xp_total = (user_xp + xp_to_give) - needed_xp;
                        final_xp_total = _user.total_xp + xp_to_give;
                        level++
                        database.getServer(msg.guild.id).then(server => {
                            let server_data = JSON.parse(server)
                            if (server_data.leveldms == true && _user_settings.leveldms == undefined || server_data.leveldms == true && _user_settings.leveldms == true || server_data.leveldms == false && _user_settings.leveldms == true) {
                                let embed = new RichEmbed()
                                .setAuthor(guild.name, guild.iconURL)
                                .addField(`You Levelled up in ${guild.name}!`, `You levelled up to level ${level}`)
                                .addField("Want to level up faster?", "[Consider Voting, You get a 12 hour XP boost](https://discordbots.org/bot/575977933492191232/vote)")
                                .addField("Don't want these messages?", `Ask a moderator in [${guild.name}](https://discordapp.com/channels/${guild.id}/) to run \`@Ichigo leveldms\`\nor run \`@Ichigo userleveldms\` in any server with me in it to disable it completely!`)
                                user.send({embed}).catch(e => {
                                    console.log("Cant send DM to(" + user.name + ") [" + user.id + "]")
                                })
                            } else if ((server_data.leveldms == false && _user_settings.leveldms == undefined) || (server_data.leveldms == undefined && _user_settings.leveldms == false)) return; 
                            else return
                        })
                    } else {
                        current_xp_total = user_xp + xp_to_give;
                        final_xp_total = _user.total_xp + xp_to_give;
                    }
                    let time = Date.now();
                    database.edit_user_on_guild(user.id, guild.id, {
                        level: level,
                        current_xp: current_xp_total,
                        total_xp: final_xp_total,
                        last_gained_xp: time,
                        username: user.username,
                        discrim: user.discriminator,
                        avatar: user.avatar
                    }).catch()
                }
            }
        })
    })
}