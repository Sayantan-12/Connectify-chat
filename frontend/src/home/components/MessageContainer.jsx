import React, { useEffect, useState, useRef } from "react";
import userConversation from "../../zustans/useConversations.jsx";
import { useAuth } from '../../context/AuthContext';
import { TiMessages } from "react-icons/ti";
import { GrSend } from "react-icons/gr";
import { MdKeyboardArrowLeft } from "react-icons/md";
import axios from 'axios';
import { IoIosSend } from "react-icons/io";
import { useSocketContext } from "../../context/socketContext.jsx";   

const MessageContainer = ({ onBackUser }) => {
    const { authUser } = useAuth();
    const { messages, selectedConversation, setMessage, setSelectedConversation } = userConversation();
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [sendData, setSendData] = useState("");
    const {socket} = useSocketContext();

    const messagesEndRef = useRef(null); // Auto-scroll ref

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(()=>{
      socket?.on("newMessage",(newMessage)=>{
        setMessage([...messages,newMessage])
      })

      return ()=> socket?.off("newMessage");
    },[socket,setMessage,messages])


    useEffect(() => {
        const getMessages = async () => {
            setLoading(true);
            try {
                const get = await axios.get(`/api/message/${selectedConversation?._id}`, { withCredentials: true });
                const data = await get.data;
                if (data.success === false) {
                    setLoading(false);
                    console.log(data.message);
                }
                setLoading(false);
                setMessage(data);
            }
            catch (error) {
                setLoading(false);
                console.log(error);
            }
        }

        if (selectedConversation?._id) getMessages();

    }, [selectedConversation?._id, setMessage])

    console.log(messages);

    const handleMessages = (e) => {
        setSendData(e.target.value)
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setSending(true);
        try {
            const res =await axios.post(`/api/message/send/${selectedConversation?._id}`,{message:sendData}, { withCredentials: true });
            const data = await res.data;
            if (data.success === false) {
                setSending(false);
                console.log(data.message);
            }
            setSending(false);
            setSendData('')
            setMessage([...messages,data])
        } catch (error) {
            setSending(false);
            console.log(error);
        }
    }


    return (
        <div className='md:min-w-[550px] h-[99%] flex flex-col py-2'>
            {selectedConversation === null ? (
                <div className='flex items-center justify-center w-full h-full'>
                    <div className='px-4 text-center text-2xl text-white font-semibold flex flex-col items-center gap-2'>
                        <p className='text-2xl'>Welcome!! {authUser.fullname}</p>
                        <p className="text-lg">Select a chat to start messaging</p>
                        <TiMessages className='text-6xl text-center' />
                    </div>
                </div>
            ) : (

                <>
                    <div className='flex justify-between gap-1 bg-gradient-to-r from-purple-200 to-pink-800 md:px-4 rounded-full h-10 md:h-12'>
                        <div className='flex gap-2 md:justify-between items-center w-full'>
                            <div className='md:hidden ml-1 self-center'>
                                <button onClick={() => onBackUser(true)} className='bg-white rounded-full px-2 py-1 self-center'>
                                    <MdKeyboardArrowLeft size={25} />
                                </button>
                            </div>
                            <div className='flex justify-between mr-2 gap-2'>
                                <div className='self-center'>
                                    <img className='rounded-full w-6 h-6 md:w-10 md:h-10 cursor-pointer' src={selectedConversation?.profilepic} />
                                </div>
                                <span className='text-gray-950 self-center text-sm md:text-xl font-bold'>
                                    {selectedConversation?.username}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto p-4 space-y-4">
                        {loading && (
                            <div className="flex w-full h-full flex-col items-center justify-center gap-4">
                                <div className="loading loading-spinner"></div>
                            </div>
                        )}

                        {!loading && messages?.length === 0 && (
                            <p className="text-center text-gray-300 mt-8">
                                Send a message to start a conversation
                            </p>
                        )}

                        {!loading &&
                            messages?.length > 0 &&
                            messages.map((message, idx) => {
                                const isSender = message.senderId === authUser._id;
                                return (
                                    <div
                                        key={message._id || idx}
                                        className={`flex items-end ${isSender ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`relative max-w-[70%] p-3 rounded-lg text-sm ${isSender
                                                ? 'bg-gradient-to-r from-pink-800 to-gray-800 text-white rounded-br-none'
                                                : 'bg-gradient-to-l from-pink-800 to-gray-800 text-white rounded-bl-none'
                                                }`}
                                        >
                                            {message.message}
                                        </div>
                                    </div>
                                );
                            })}
                        <div ref={messagesEndRef} /> {/* Auto-scroll target */}
                    </div>

                    <form onSubmit={handleSubmit} className='rounded-full text-black'>
                        <div className='w-full rounded-full flex items-center bg-white'>
                            <input value={sendData} onChange={handleMessages} required id='message' type='text'
                                className='w-full bg-transparent outline-none px-4 rounded-full' placeholder='Send Message...'/>
                            <button type='submit'>
                                {sending ? <div className='loading loading-spinner'></div> :
                                    <IoIosSend size={20}
                                        className='text-white cursor-pointer rounded-full bg-gradient-to-r from-pink-800 to-gray-800 w-10 h-auto p-2' />
                                }
                            </button>
                        </div>
                    </form>

                </>
            )}
        </div>
    )
};

export default MessageContainer;
