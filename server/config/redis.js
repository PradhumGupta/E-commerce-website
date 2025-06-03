import { createClient } from 'redis';

const redisClient = createClient({
    username: 'default',
    password: 'z8X8zFEGYrdkEGQO1b13kM0dzHqnNaBA',
    socket: {
        host: 'redis-12558.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 12558
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

await redisClient.connect();

await redisClient.set('foo', 'bar');
const result = await redisClient.get('foo');
console.log(result)  // >>> bar

export default redisClient;