import { createClient } from 'redis';

export const redisClient = createClient({
    // username: 'default',
    // password: 'MhpcVrwtqoHqTS1dskrxIgXBUjdQb5L8',
    socket: {
        // host: 'redis-19189.c341.af-south-1-1.ec2.redns.redis-cloud.com',
        host:"localhost",
        // port: 19189
        port: 6379
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

export const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log('Connected to Redis successfully');
    }
};