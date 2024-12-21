import * as redis from "redis";

const redisClient = redis.createClient({
    url:process.env.REDIS_URL || "redis://default:password@localhost:6379"
});

export const getRedisClient= async ()=>{
    return redisClient;
}