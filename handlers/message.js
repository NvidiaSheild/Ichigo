let command = require('./command')
let settings = require('../settings')
let discord = require('discord.js')
let database = require('./database')

exports.handle = (client, msg, server_settings) => {
    if (msg.author.bot) return;
    let cleaned_content = msg.content.replace(/[ ]+/g, " ")
    let prefix = cleaned_content.substr(0, server_settings.prefix.length);
    let server_prefix = server_settings.prefix.toLowerCase();
    if (cleaned_content.substr(0, server_settings.prefix.length).toLowerCase() == server_settings.prefix.toLowerCase()) {
        let command_name = cleaned_content.substr(server_settings.prefix.length).trim().split(" ")[0].toLowerCase()
        let args = cleaned_content.substr(server_settings.prefix.length).trim().split(" ").splice(1)
        command.fetch(command_name).then(cmd => {
            try {
                if (settings.vote_lock && cmd.info.votelocked) {
                    database.user_has_voted(msg.author.id).then(bool => {
                        if (bool == false || bool == "false") {
                            let embed = new discord.RichEmbed().addField("You are required to vote to use this command.", "[Click here to be taken to the vote page.](https://discordbots.org/bot/575977933492191232/vote)").setColor('#7289da')
                            return msg.channel.send(embed)
                        } else {
                            cmd.run(client, msg, args, server_settings)
                        }
                    })
                } else {
                    cmd.run(client, msg, args, server_settings)
                }
            } catch (e) {
                return client.logs.error(e)
            }
        }).catch(err => {
            if (err == "Command not found") {
                if (server_settings.customcommands) {
                    if (server_settings.customcommands[command_name]) {
                        return msg.channel.send(server_settings.customcommands[command_name])
                    };
                };
                if (server_settings.commandaliases) {
                    if (server_settings.commandaliases[command_name]) {
                        command.fetch(server_settings.commandaliases[command_name]).then(cmd => {
                            try {
                                if (settings.vote_lock && cmd.info.votelocked) {
                                    database.user_has_voted(msg.author.id).then(bool => {
                                        if (bool == false || bool == "false") {
                                            let embed = new discord.RichEmbed().addField("You are required to vote to use this command.", "[Click here to be taken to the vote page.](https://discordbots.org/bot/575977933492191232/vote)").setColor('#7289da')
                                            return msg.channel.send(embed)
                                        } else {
                                            cmd.run(client, msg, args, server_settings)
                                        }
                                    })
                                } else {
                                    cmd.run(client, msg, args, server_settings)
                                }
                            } catch (e) {
                                return client.logs.error(e)
                            }
                        }).catch(e => { if (e == "Command not found") return; else client.logs.error(e) })
                    }
                }
            } else if (err !== "Command not found") {
                client.logs.error(err)
            }
        })
    }
    else if (cleaned_content.split(" ")[0] == `<@${client.user.id}>` || cleaned_content.split(" ")[0] == `<@!${client.user.id}>`) {
        let command_name = cleaned_content.split(" ")[1]
        let args = cleaned_content.trim().split(" ").splice(2)
        let voteembed = new discord.RichEmbed().addField("Want to support the bot?", "[Vote for Ichigo](https://discordbots.org/bot/575977933492191232/vote)\n[Pledge on Patreon](https://www.patreon.com/Discord_Ichigo)").setColor('#7289da')
        command.fetch(command_name).then(cmd => {
            try {
                if (settings.vote_lock && cmd.info.votelocked) {
                    database.user_has_voted(msg.author.id).then(bool => {
                        if (bool == false || bool == "false") {
                            let embed = new discord.RichEmbed().addField("You are required to vote to use this command.", "[Click here to be taken to the vote page.](https://discordbots.org/bot/575977933492191232/vote)").setColor('#7289da')
                            return msg.channel.send(embed)
                        } else {
                            cmd.run(client, msg, args, server_settings)
                        }
                    })
                } else {
                    cmd.run(client, msg, args, server_settings)
                }
            } catch (e) {
                return client.logs.error(e)
            }
        }).catch(err => {
            if (err == "Command not found") {
                if (server_settings.customcommands) {
                    if (server_settings.customcommands[command_name]) {
                        return msg.channel.send(server_settings.customcommands[command_name])
                    }
                }
                if (server_settings.commandaliases && server_settings.commandaliases[command_name]) {
                    command.fetch(server_settings.commandaliases[command_name]).then(cmd => {
                        try {
                            if (settings.vote_lock && cmd.info.votelocked) {
                                database.user_has_voted(msg.author.id).then(bool => {
                                    if (bool == false || bool == "false") {
                                        let embed = new discord.RichEmbed().addField("You are required to vote to use this command.", "[Click here to be taken to the vote page.](https://discordbots.org/bot/575977933492191232/vote)").setColor('#7289da')
                                        return msg.channel.send(embed)
                                    } else {
                                        cmd.run(client, msg, args, server_settings)
                                    }
                                })
                            } else {
                                cmd.run(client, msg, args, server_settings)
                            }
                        } catch (e) {
                            return client.logs.error(e)
                        }
                    }).catch(e => { if (e == "Command not found") return; else client.logs.error(e) })
                }
            } else if (err !== "Command not found") {
                client.logs.error(err)
            }
        })
    }
}