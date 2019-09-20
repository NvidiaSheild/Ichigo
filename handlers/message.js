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

    let botMentioned = false;
    let commandName, serverPrefix, usedPrefix;

    if (args[0] === `<@${client.user.id}>` || args[0] === `<@!${client.user.id}>`) {
        args.shift();
        botMentioned = true;
        commmandName = args.length === 0 ? `help` : args.shift(); // Set command to "help" if none was specified
    } else {
        let command = args.shift();
        serverPrefix = serverSettings.prefix.toLowerCase();
        usedPrefix = command.substring(0, serverPrefix.length).toLowerCase();
        commmandName = command.substring(serverPrefix.length - 1);
    }

    if (botMentioned || usedPrefix == serverPrefix) {
        commands.fetch(commandName).then(cmd => {
            try {
                if (settings.vote_lock && cmd.info.votelocked) {
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
            } catch (e) {
                return client.logs.error(e)
            }
        }).catch(err => {
            if (err.code === "MODULE_NOT_FOUND") {
                // Check for custom command
                if (server_settings.customcommands && server_settings.customcommands[command_name]) {
                    return msg.channel.send(server_settings.customcommands[command_name])
                };
                // Check for command alias
                if (server_settings.commandaliases && server_settings.commandaliases[command_name]) {
                    command.fetch(server_settings.commandaliases[command_name]).then(cmd => {
                        try {
                            if (settings.vote_lock && cmd.info.votelocked) {
                                database.user_has_voted(msg.author.id).then(userVoted => {
                                    if (userVoted === false) {
                                        return msg.channel.send(voteLockedResponse)
                                    } else {
                                        cmd.run(client, msg, args, serverSettings)
                                    }
                                });
                            } else {
                                cmd.run(client, msg, args, server_settings)
                            }
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