exports.run = (client, msg, args, server_settings) => {
    return msg.channel.send(`[Shard ${client.shard.id}] Ping! \`${Math.round(client.ping)}ms\``);
}

exports.info = {
    "name": "ping",
    "type": "basic",
    "description": "get the ping of the current shard."
}