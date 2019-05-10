const zalgo = require('zalgolize');


exports.run  = (client, msg, args) => {
    const text = args.join(" ");
    if(text.lenth > 500) {
        return msg.channel.send(`Message must be under 500 characters:\n**Yours was ${text.length}**`)
    }
    return msg.channel.send(`\u180E${zalgo(text, 0.2, [10, 5, 10])}`);
}

exports.info = {
    "name": "zalgo",
    "description": "make your text somewhat unreadable",
    "example": "zalgo [text]",
    "type": "basic"
}