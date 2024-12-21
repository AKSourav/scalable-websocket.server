import * as redis from "redis";
import {WebSocket} from 'ws';

interface RoomMap{
    [key: string]: WebSocket[]
}
interface UserMap{
    userWS: WebSocket,
    rooms: string[]
}

export class UserManager {
    private userMapping:  UserMap[]= [];
    private roomMapping: RoomMap= {}
    private redisClient:redis.RedisClientType<any> | undefined;
    constructor() {
        this.connectRedis();
    }
    async connectRedis(){
        try{
            this.redisClient = redis.createClient({
                url:process.env.REDIS_URL || "redis://default:password@localhost:6379"
            });
            const subscriber = this.redisClient.duplicate();
            await subscriber.connect();
            await subscriber.subscribe('channel', (message: string) => {
                message = JSON.parse(message);
                console.log("redis message: ",message);
            });
        }catch(err)
        {
            console.log("ERRor Connecting to Redis:", err);
        }
    }
    connect(userWS: WebSocket){
        this.userMapping.push({userWS,rooms:[]});
    }
    disconnect(userWS:WebSocket){
        const connectionInfo = this.userMapping.find(connectionInfo=>connectionInfo.userWS===userWS);
        this.userMapping.filter((connectionInfo:UserMap)=>connectionInfo.userWS!==userWS);
        if(connectionInfo)
        {
            const {rooms} = connectionInfo;
            rooms.forEach(room=>{
                this.roomMapping[room]?.filter(_userWS=>_userWS!==userWS);
                if(this.roomMapping[room] && this.roomMapping[room].length===0) delete this.roomMapping[room];
            })
        }
    }
    join(userWS: WebSocket, room: string){
        this.roomMapping[room].push(userWS);
    }
}