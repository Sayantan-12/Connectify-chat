import { Server } from "socket.io";
import http from 'http';
import express from 'express';

const app = express();

const server = http.createServer(app); // A server is created on the top of the express server app

const io = new Server(server,{
    cors:{
        origin:['https://connectify-chat.onrender.com'],
        methods:["GET","POST"]
    }
});

export const getReciverSocketId = (receverId)=>{
    return userSocketmap[receverId];
};

const userSocketmap={} //{userId, socketId}

io.on('connection',(socket)=>{
    const userId = socket.handshake.query.userId;

    if(userId !== "undefined") userSocketmap[userId] = socket.id;
    io.emit("getOnlineUsers",Object.keys(userSocketmap))

    socket.on('disconnect',()=>{
        delete userSocketmap[userId],
        io.emit('getOnlineUsers',Object.keys(userSocketmap))
    });
});

export {app , io , server}