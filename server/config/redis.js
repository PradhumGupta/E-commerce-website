import { createClient } from 'redis';
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from './env.js';

const redisClient = createClient({
    username: 'default',
    password: REDIS_PASSWORD,
    socket: {
        host: REDIS_HOST,
        port: REDIS_PORT
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

await redisClient.connect();

await redisClient.set('foo', 'bar');
const result = await redisClient.get('foo');
console.log(result)  // >>> bar

export default redisClient;