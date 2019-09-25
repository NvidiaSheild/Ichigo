const settings = require('../settings');

exports.reboot = (client, id) => {
    if (client.ws.shards.get(0).id == id) {
        process.exit()
    }
}

exports.run = (client, msg, args, server_settings) => { 
    if (!settings.eval_users.includes(msg.author.id)) return;
    client.shard.broadcastEval("process.exit()");
}

exports.info = {
    "name": "reboot",
    "type": "owner",
    "description": "reboot the bot.",
    "vote_locked": false
}