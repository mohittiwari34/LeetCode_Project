const { createClient }  = require('redis');

const reddisClient = createClient({
    username: 'default',
    password: process.env.REDDIS_PASS,
    socket: {
        host: process.env.REDDIS_HOST,
        port: 16346
    }
});

module.exports= reddisClient;

// client.on('error', err => console.log('Redis Client Error', err));

// await client.connect();

// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar

