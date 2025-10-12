import React, { useEffect, useState } from "react";
import { FaSearch } from 'react-icons/fa'
import axios from 'axios';
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom'
import { IoArrowBackSharp } from 'react-icons/io5';
import { ImBackward2 } from "react-icons/im";
import { BiLogOut } from "react-icons/bi";
import userConversation from "../../zustans/useConversations.jsx";
import { useSocketContext } from '../../context/socketContext.jsx';
import { FaCircle } from "react-icons/fa";

const Sidebar = ({ onSelectUser }) => {

    const navigate = useNavigate();
    const { authUser, setAuthUser } = useAuth();
    const [searchInput, setSearchInput] = useState('');
    const [searchUser, setSearchUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chatUser, setChatUser] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const { socket } = useSocketContext();
    const [newMessageUsers, setNewMessageUsers] = useState('');
    const { messages, setMessage, selectedConversation, setSelectedConversation } = userConversation();

    useEffect(() => {
        socket?.on("newMessage", (newMessage) => {
            setNewMessageUsers(newMessage)
        })
        return () => socket?.off("newMessage");
    }, [socket, messages])

    useEffect(() => {
    const chatUserHandler = async () => {
        try {
            const chatters = await axios.get(`/api/user/currentchatters`, { withCredentials: true });
            setChatUser(chatters.data);
        } catch (error) {
            console.log(error);
        }
    };

    chatUserHandler();
}, [newMessageUsers, selectedConversation]);


    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const search = await axios.get(`/api/user/search?search=${searchInput}`, { withCredentials: true });
            const data = search.data;
            if (data.length === 0) {
                toast.info("User Not Found");
            } else {
                setSearchUser(data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserClick = (user) => {
        onSelectUser(user);
        setSelectedConversation(user);
        setSelectedUserId(user._id);
        setNewMessageUsers('');
        // Add your other click logic here (e.g., select conversation)
    };

    const handSearchback = () => {
        setSearchUser([]);
        setSearchInput('')
    }

    const handleLogOut = async () => {

        // const confirmlogout = window.prompt("type 'UserName' To LOGOUT");
        // if (confirmlogout === authUser.username) {
        setLoading(true)
        try {
            const logout = await axios.post('/api/auth/logout', { withCredentials: true })
            const data = logout.data;
            if (data?.success === false) {
                setLoading(false)
                console.log(data?.message);
            }
            toast.info(data?.message)
            localStorage.removeItem('chatapp')
            setAuthUser(null)
            setLoading(false)
            navigate('/login')
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
        // } else {
        //     toast.info("LogOut Cancelled")
    }

    return (
        <div className='h-full w-full p-4 rounded-xl bg-gradient-to-b from-purple-200 to-blue-800 border-r border-gray-200'>
            {/* Search Section */}
            <div className='flex justify-center mb-6'>
                <form
                    onSubmit={handleSearchSubmit}
                    className='flex items-center w-full max-w-full sm:max-w-md bg-white rounded-full shadow-md border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all'
                >
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        type='text'
                        className='flex-grow min-w-0 px-4 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-500'
                        placeholder='Search User'
                    />
                    <button
                        type="submit"
                        className='flex-shrink-0 w-10 h-10 bg-gradient-to-t from-blue-900 to-purple-400 hover:bg-blue-700 text-white rounded-full flex items-center justify-center cursor-pointer transition duration-200 transform hover:scale-105 active:scale-95'
                    >
                        <FaSearch size={16} />
                    </button>
                </form>
                <img
                    onClick={() => navigate(`/profile/${authUser?._id}`)}
                    src={authUser?.profilepic}
                    className='self-center h-12 w-14 rounded-full shadow-md border-2 border-purple-800 bg-white hover:scale-110 cursor-pointer transition-transform duration-200'
                />
            </div>

            <div className="border-t border-gray-400 my-4"></div>

            {searchUser?.length > 0 ? (
                <>
                    <div className="min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar ">
                        <div className='w-auto'>
                            {searchUser.map((user) => (
                                <div key={user._id}>
                                    <div
                                        onClick={() => handleUserClick(user)}
                                        className={`flex gap-3 items-center rounded-full p-2 py-1 cursor-pointer ${selectedUserId === user._id ? 'bg-purple-400' : ''}`}
                                    >
                                        {/* Socket is Online */}
                                        <div className="avatar">
                                            <div className="w-12 h-12 rounded-full border-2 border-green-500 overflow-hidden bg-white">
                                                <img src={user.profilepic} alt='user.img' className="w-full h-full object-cover rounded-full" />
                                            </div>
                                        </div>
                                        <div className='flex flex-col flex-1'>
                                            <p className='font-bold text-gray-950'>{user.username}</p>
                                        </div>
                                    </div>
                                    <div className='divider divide-solid px-3 h-[1px]'></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='mt-auto px-1 py-1 flex'>
                        <button onClick={handSearchback} className='w-10 h-10 min-w-10 m-1 bg-blue-600 hover:bg-yellow-400 text-white rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 transform hover:scale-105 active:scale-95'
                        >
                            <ImBackward2 size={25} />
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="min-h-[70%] max-h-[80%] overflow-y-auto scrollbar">
                        {chatUser.length === 0 ? (
                            <div className='font-bold items-center flex flex-col text-xl text-yellow-500'>
                                <h1>Why are you Alone!!</h1>
                                <h1>Search username to chat</h1>
                            </div>
                        ) : (
                            chatUser.map((user, index) => (
                                <div key={user._id}>
                                    <div
                                        onClick={() => handleUserClick(user)}
                                        className={`flex gap-3 items-center rounded-full p-2 py-1 cursor-pointer ${selectedUserId === user._id ? 'bg-gradient-to-r from-purple-400 to-blue-900' : ''}`}
                                    >
                                        <div className={`avatar`}>
                                            <div className="w-12 h-12 rounded-full border-2 border-green-500 overflow-hidden bg-white">
                                                <img src={user.profilepic} alt='user' className="w-full h-full object-cover rounded-full" />
                                            </div>
                                        </div>
                                        <div className='flex flex-col flex-1'>
                                            <p className='font-bold text-gray-950'>{user.username}</p>
                                        </div>

                                        <div>
                                            {newMessageUsers.reciverId === authUser._id && newMessageUsers.senderId === user._id ?
                                                <div className="rounded-full text-sm text-green-700 px-[4px] animate-pulse drop-shadow-[0_0_6px_#22c55e]"><FaCircle size={12}/></div> : <></>
                                            }
                                        </div>

                                    </div>
                                    <div className="border-t border-gray-400 my-4"></div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className='mt-auto px-1 py-1 flex'>
                        <button onClick={handleLogOut} className='w-10 h-10 min-w-10 m-1 bg-yellow-400 hover:bg-red-700 text-white rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 transform hover:scale-105 active:scale-95'>
                            <BiLogOut size={25} />
                        </button>
                    </div>
                </>
            )}

        </div>
    );
};

export default Sidebar;