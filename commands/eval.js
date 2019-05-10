let settings = require('../settings')

const clean = text => {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

exports.run = (client, msg, args, server_settings) => {
    if(!settings.eval_users.includes(msg.author.id)) return;
    try {
        const code = msg.content.split(" ").slice(2).join(" ");
        let evaled = eval(code);
        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);
        msg.channel.send(clean(evaled), {split: true, code:"xl"});
    } catch (err) {
        msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
}

exports.info = {
  "name": "eval",
  "type": "owner",
  "description": "evaluate code on the bot."
}