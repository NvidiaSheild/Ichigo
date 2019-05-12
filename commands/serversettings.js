let discord = require('discord.js')

exports.run = (client, msg, args, server_settings) => {
        server_settings = JSON.parse(server_settings)
        let embed = new discord.RichEmbed();
        embed.addField("Prefix", JSON.parse(server_settings).prefix);
        if (server_settings.modlog) {
                embed.addField("Modlog", `<#${JSON.parse(server_settings).modlog}>`)
        }
        if (server_settings.bot_join_role) {
                embed.addField("Bot Join Role", `<@&${JSON.parse(server_settings).botjoinrole}>`)
        }
        if (server_settings.user_join_role) {
                embed.addField("User Join Role", `<@&${JSON.parse(server_settings).userjoinrole}>`)
        }
        
        return msg.channel.send(embed)
}

exports.info = {
        "name": "serversettings",
        "type": "basic",
        "description": "get the current guild settings.",
        "example": "serversettings"
}