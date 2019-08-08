let settings = require('../settings')
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const clean = text => {
    if (typeof (text) === 'string') {return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));}
    else {return text;}
};

exports.run = (client, msg, args, server_settings) => {
    if(!settings.eval_users.includes(msg.author.id)) return;
    const code = args.join(' ');
    exec(code).then(output => {
        msg.channel.send(clean(output.stdout), {split: true, code:"js"});
    }).catch((stderr) => {
        msg.channel.send(`\`ERROR\` \`\`\`xl\n${stderr}\n\`\`\``);
    });
}

exports.info = {
  "name": "exec",
  "type": "owner",
  "description": "execute scripts on the bots host."
}