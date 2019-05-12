const fs = require('fs')

exports.run = (client, msg, args, server_settings) => {
    let help_catagory = args[0]
    if(!help_catagory) {
        msg.channel.send(`Available Catagories:\n\`\`\`prolog\n[Basic]: Commands the basic user can use\n[Moderator]: Commands for moderation\n[Admin]: Commands to alter the settings for the bot\`\`\``)
    } else {
        /* I don't even remember how the fuck I conjured this up */
        command_files = fs.readdirSync(`${process.cwd()}/commands/`).map(command => command.split(".")[0])
        let numbers = require('fs').readdirSync(`${process.cwd()}/commands/`).map(command => command.split(".")[0]).map(command_name => command_name.length); 
        let largest = Math.max.apply(Math, numbers);
        let output_text = "<Command>" + "<Description>\n".padStart(largest+11, " ")
        let cmd_text = command_files.map(command => {
            let cmd_info = require(`${process.cwd()}/commands/${command}`).info
            if (!cmd_info) return;
            if (cmd_info.type !== help_catagory) return;
            output_text += `[${cmd_info.name.capitalize()}]`.padEnd(largest+6, " ") + `${cmd_info.description}\n`
        });
        return msg.channel.send(output_text, {split: true, code:"prolog"})
    }
    
}

exports.info = {
    "name": "help",
    "type": "basic",
    "description": "get the available commands for the bot.",
    "example": "help [basic/moderator/admin]"
}