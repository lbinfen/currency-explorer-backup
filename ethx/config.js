var fs = require('fs');

var config = undefined;

module.exports = function (path) {
    try {
        if (config === undefined) {
            if(path === undefined)
                path = './tools/config.json';
            config = JSON.parse(fs.readFileSync(path));
            console.log('Using configuration:');
            console.log(config);
        }
        if ('mongoUri' in config && (typeof config.mongoUri) == 'string' && 'gethRpc' in config && (typeof config.gethRpc) == 'string')
            return config;
        else
            throw new Error('Failed to get config from config.json, process exit.');
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            console.log('No config file found, process exit.');
        }
        else {
            console.log(error);
        }
        throw error;
        process.exit(1);
    }
}

