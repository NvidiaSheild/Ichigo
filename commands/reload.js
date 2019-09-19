const settings = require('../settings')

exports.reload = (command_to_reload) => {
    try {
        require.resolve(`${process.cwd()}/commands/${command_to_reload}.js`)
    } catch (e) {
        return e.message
    }
    return delete require.cache[require.resolve(`${process.cwd()}/commands/${command_to_reload}.js`)];
}

exports.run = (client, msg, args, server_settings) => {
    if (!settings.eval_users.includes(msg.author.id)) return;
    try {
        let command_to_reload = args[0]
        let require_dir = process.cwd().replace("\\", "/").replace("\\", "/");
        shard_ids = client.ws.shards.map(sh => sh.id)
        client.shard.broadcastEval(`require("${require_dir}/commands/reload").reload("${command_to_reload}")`).then(results => {
            let text = `[Shard]\t[Reloaded]\n`;
            let out_txt = shard_ids.forEach(shard => {
                text += `[Shard ${shard}]:\t ${results[shard]}\n`;
            });
            msg.channel.send(text, { split: true, code: "prolog" });
        })
    } catch (e) {
        client.logs.error(e)
        if (e.code == "MODULE_NOT_FOUND") {
            return msg.channel.send("That command doesn't exist")

        } else {
            reject(e)
        }
    }
}

exports.info = {
    "name": "reload",
    "type": "owner",
    "description": "reload a command on the bot."
}