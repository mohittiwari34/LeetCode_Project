const { createClient }  = require('redis');

const reddisClient = createClient({
    username: 'default',
    password: '0ds3RSnOkzzEecU6vxq2vCZ4hTUKy5gy',
    socket: {
        host: 'redis-15077.c270.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 15077
    }
});

module.exports= reddisClient;

// client.on('error', err => console.log('Redis Client Error', err));

// await client.connect();

// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar

