import mongoose from "mongoose";
import Conversation from "./conversationModel.js";

const messageSchema = mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    reciverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    message:{
        type:String,
        required: true
    },
    ConversationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Conversation",
        deafult: []
    },
},{timestamps:true})

const Message = mongoose.model("Message", messageSchema);

export default Message;