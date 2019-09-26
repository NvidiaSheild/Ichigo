let commands = require('./command');
let settings = require('../settings');
let database = require('./database');

let voteLockedResponse = {
    embed: {
        title: `You are required to vote to use this command.`,
        description: `[Click here to be taken to the vote page.](https://discordbots.org/bot/575977933492191232/vote)`,
        color: 0x7289da
    }
};

exports.handle = (client, msg, serverSettings) => {

    // Don't reply to other bots or messages in DM channels
    if (msg.author.bot || msg.channel.type === 1) return;

    let args = msg.content.split(/[ ]+/);
    if (args.length == 0) return;

    let botMentioned = false;
    let commandName = args[1];
    let serverPrefix;
    let usedPrefix = args[0];

    if (args[0] === `<@${client.user.id}>` || args[0] === `<@!${client.user.id}>`) {
        botMentioned = true;
        if (!args[1]) {
            commandName = "help";
            args = [];
        } else {
            args = args.splice(2)
        }
    } else {
        usedPrefix = args[0].toLowerCase();
        serverPrefix = serverSettings.prefix.toLowerCase();
        args = args.splice(2)
    }

    if (botMentioned || usedPrefix == serverPrefix) {
        commands.fetch(commandName.toLowerCase()).then(cmd => {
            database.is_blacklisted(msg.author.id).then(out => {
                if (out.active == true) {
                    return msg.channel.send({
                        embed: {
                            title: "You are currently blacklisted.",
                            description: "To appeal this blacklist please join the [Support Server](https://discord.gg/34k4Mk2) to talk the blacklist over with an admin/owner",
                            color: 0x7289da
                        }
                    })
                } else if (settings.vote_lock && cmd.info.votelocked) {
                    database.user_has_voted(msg.author.id).then(userVoted => {
                        if (userVoted === false) {
                            return msg.channel.send(voteLockedResponse)
                        } else {
                            cmd.run(client, msg, args, serverSettings)
                        }
                    });
                } else {
                    cmd.run(client, msg, args, serverSettings)
                }
            });
        }).catch(err => {
            if (err.code === "MODULE_NOT_FOUND") {
                // Check for custom command
                if (serverSettings.customcommands && serverSettings.customcommands[commandName]) {
                    return msg.channel.send(serverSettings.customcommands[commandName])
                };
                // Check for command alias
                if (serverSettings.commandaliases && serverSettings.commandaliases[commandName]) {
                    command.fetch(serverSettings.commandaliases[commandName]).then(cmd => {
                        try {
                            database.is_blacklisted(msg.author.id).then(out => {
                                if (out.active == true) {
                                    return msg.channel.send({
                                        embed: {
                                            title: "You are currently blacklisted.",
                                            description: "To appeal this blacklist please join the [Support Server](https://discord.gg/34k4Mk2) to talk the blacklist over with an admin/owner",
                                            color: 0x7289da
                                        }
                                    })
                                } else if (settings.vote_lock && cmd.info.votelocked) {
                                    database.user_has_voted(msg.author.id).then(userVoted => {
                                        if (userVoted === false) {
                                            return msg.channel.send(voteLockedResponse)
                                        } else {
                                            cmd.run(client, msg, args, serverSettings)
                                        }
                                    });
                                } else {
                                    cmd.run(client, msg, args, serverSettings)
                                }
                            });
                        } catch (e) {
                            return client.logs.error(e)
                        }
                    }).catch(e => { if (e == "Command not found") return; else client.logs.error(e) })
                }
            } else {
                client.logs.error(err)
            }
        });
    }
}