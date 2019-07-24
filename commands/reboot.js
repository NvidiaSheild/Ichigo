const settings = require('../settings');

exports.run = (client, msg, args, server_settings) => { 
    if (!settings.eval_users.includes(msg.author.id)) return;
    process.exit()
}

exports.info = {
    "name": "reboot",
    "type": "owner",
    "description": "reboot the bot.",
    "vote_locked": false
}