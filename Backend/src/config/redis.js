const { createClient } = require('redis');

let clientConfig = {};

if (process.env.REDIS_URL || process.env.REDDIS_URL) {
    clientConfig = {
        url: process.env.REDIS_URL || process.env.REDDIS_URL
    };
} else if (process.env.REDDIS_HOST) {
    clientConfig = {
        username: 'default',
        password: process.env.REDDIS_PASS,
        socket: {
            host: process.env.REDDIS_HOST,
            port: process.env.REDDIS_PORT ? parseInt(process.env.REDDIS_PORT) : (process.env.REDDIS_HOST.includes('redislabs') ? 16346 : 6379)
        }
    };
}

if (!clientConfig.socket) {
    clientConfig.socket = {};
}

clientConfig.socket.reconnectStrategy = (retries) => {
    if (retries > 3) {
        console.warn("Redis reconnect attempts exceeded. Running without active Redis connection.");
        return false;
    }
    return Math.min(retries * 500, 2000);
};

const reddisClient = createClient(clientConfig);

reddisClient.on('error', (err) => {
    console.warn('Redis Client Warning:', err.message);
});

module.exports = reddisClient;
