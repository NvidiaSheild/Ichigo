exports.run = (client, msg, args, server_settings) => {
    return msg.channel.send(["Tails", "Heads"][Math.round(Math.random())])
}

exports.info = {
    "name": "coinflip",
    "description": "flip a coin",
    "example": "coinflip",
    "type": "basic"
}