import User from "../Models/userModel.js";
import Conversation from "../Models/conversationModel.js";

export const getUserBySearch = async(req,res)=>{
    try{
        const search = req.query.search || '';
        const currentUserID = req.user._id;    //This is for to find out who is logged in
        const user = await User.find({
            $and:[
                {
                    $or:[
                        {username:{$regex:'.*'+search+'.*',$options:'i'}},  //options helps us to search a user with capital or small letters and get the same result
                        {fullname:{$regex:'.*'+search+'.*',$options:'i'}}
                    ]
                },{
                    _id:{$ne:currentUserID}
                }
            ]
        }).select("-password").select("email")

        res.status(200).send(user)

    }
    catch(error){
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(error);
    }
}

export const getCorrentChatters = async(req,res)=>{
    try{
        const currentUserID = req.user._id;     //This is for to find out who is logged in
        const currenTChatters = await Conversation.find({
            participants:currentUserID
        }).sort({
            updatedAt: -1        //Whoever is messaged last show them on top sorting based on updated at in the schema
            });

            if(!currenTChatters || currenTChatters.length === 0)  return res.status(200).send([]);      //We dont have noone to msg

            const partcipantsIDS = currenTChatters.reduce((ids,conversation)=>{
                const otherParticipents = conversation.participants.filter(id => id !== currentUserID);
                return [...ids , ...otherParticipents]
            },[])

            const otherParticipentsIDS = partcipantsIDS.filter(id => id.toString() !== currentUserID.toString());    // Convert the objectId to string

            const user = await User.find({_id:{$in:otherParticipentsIDS}}).select("-password").select("-email");    //Find the users in the database and filter to remove email and password

            const users = otherParticipentsIDS.map(id => user.find(user => user._id.toString() === id.toString()));   // Map the data to send in the frontend

            res.status(200).send(users)
    }
    catch(error){
        res.status(500).send({
            success: false,
            message: error
        })
        console.log(error);
    }
}