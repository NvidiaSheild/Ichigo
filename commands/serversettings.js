let discord = require('discord.js')

exports.run = (client, msg, args, server_settings) => {
        let embed = new discord.MessageEmbed();
        embed.addField("Prefix", server_settings.prefix);
        if (server_settings.modlog) {
                embed.addField("Modlog", `<#${JSON.parse(server_settings).modlog}>`)
        }
        if (server_settings.bot_join_role) {
                embed.addField("Bot Join Role", `<@&${server_settings.botjoinrole}>`)
        }
        if (server_settings.user_join_role) {
                embed.addField("User Join Role", `<@&${server_settings.userjoinrole}>`)
        }
        if (server_settings.customcommands) {
                embed.addField("Current Custom Commands", `\`\`\`json\n${JSON.stringify(server_settings.customcommands, null, 4)} \`\`\``)
        }
        if (server_settings.commandaliases) {
                embed.addField("Current Custom Aliases", `\`\`\`json\n${JSON.stringify(server_settings.commandaliases, null, 4)} \`\`\``)
        }        
        return msg.channel.send(embed)
}

exports.info = {
        "name": "serversettings",
        "type": "basic",
        "description": "get the current guild settings.",
        "example": "serversettings"
}