const fs = require('fs');

exports.fetch = (commandName) => {
    return new Promise((resolve, reject) => {
        try {
            let command = require(`${process.cwd()}/commands/${commandName}.js`);
            resolve(command);
        } catch (err) {
            reject(err);
        }
    });
}

exports.loadAll = () => {
    commandDir = fs.readdirSync(`${process.cwd()}/commands/`);
    commandDir.forEach(file => {
        require(`../commands/${file}`);
    });
}