import React, { useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify'
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {

    const navigate = useNavigate();
    const {setAuthUser} = useAuth();

    const [inputData, setInputData] = useState({})
    const [loading, setLoading] = useState(false);

    const handleInput = (e) => {
        setInputData({
            ...inputData, [e.target.id]: e.target.value
        })
    }

    console.log(inputData);
    const selectGender = (selectGender) => {
        setInputData((prev) => ({
            ...prev, gender: selectGender === inputData.gender ? '' : selectGender
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        if (inputData.password !== inputData.cnfpassword.toLowerCase()) {
            setLoading(false)
            return toast.error("Password Dosen't match")
        }
        try {
            const register = await axios.post(`/api/auth/register`, inputData);
            const data = register.data;
            if (data.success === false) {
                setLoading(false)
                toast.error(data.message)
                console.log(data.message);
            }
            toast.success(data.message)
            localStorage.setItem('chatapp', JSON.stringify(data))
            setAuthUser(data)
            setLoading(false)
            setTimeout(() => {
                navigate('/login');
            }, 200);
        } catch (error) {
            setLoading(false)
            console.log(error);
            toast.error(error?.response?.data?.message)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center mix-w-full mx-auto">
            <div className="w-full p-6 rounded-lg shadow-lg bg-purple-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20">
                <h1 className="text-3xl font-bold text-center text-gray-300">
                    Register | <span className="text-gray-950">Connectify</span>
                </h1>
                <br />
                <br />
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">

                    <input
                        id="fullname"
                        onChange={handleInput}
                        type="text"
                        placeholder="Enter your Full Name"
                        className="p-3 rounded-lg bg-white/20 text-black placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-900"
                        required
                    />
                    <input
                        id="username"
                        onChange={handleInput}
                        type="text"
                        placeholder="Enter Username"
                        className="p-3 rounded-lg bg-white/20 text-black placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-900"
                        required
                    />
                    <input
                        id="email"
                        onChange={handleInput}
                        type="email"
                        placeholder="Enter your Email"
                        className="p-3 rounded-lg bg-white/20 text-black placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-900"
                        required
                    />
                    <input
                        id="password"
                        onChange={handleInput}
                        type="password"
                        placeholder="Enter Password"
                        className="p-3 rounded-lg bg-white/20 text-black placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-900"
                    />
                    <input
                        id="cnfpassword"
                        onChange={handleInput}
                        type="password"
                        placeholder="Confirm Password"
                        className="p-3 rounded-lg bg-white/20 text-black placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-900"
                    />

                    <div id="gender" className="flex gap-6 items-center">
                        <label
                            className={`flex items-center justify-center px-5 py-2 border rounded-xl cursor-pointer transition-all duration-200 shadow-sm
    ${inputData.gender === 'male' ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-300 hover:bg-gray-100'}`}
                        >
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={inputData.gender === 'male'}
                                onChange={() => selectGender('male')}
                            />
                            Male
                        </label>

                        <label
                            className={`flex items-center justify-center px-5 py-2 border rounded-xl cursor-pointer transition-all duration-200 shadow-sm
    ${inputData.gender === 'female' ? 'border-pink-500 bg-pink-50 text-pink-700 font-semibold' : 'border-gray-300 hover:bg-gray-100'}`}
                        >
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={inputData.gender === 'female'}
                                onChange={() => selectGender('female')}
                            />
                            Female
                        </label>
                    </div>

                    <button
                        className="p-3 rounded-lg bg-purple-900 hover:bg-purple-600 text-white font-semibold transition cursor-pointer"
                        type="submit"
                    >
                        {loading ? "loading.." : "Register"}
                    </button>
                </form>

                <div className="pt-2">
                    <p className="text-sm font-semibold text-gray-800">
                        Already have an account?{" "}
                        <Link to="/login">
                            <span className="text-gray-950 font-bold underline cursor-pointer hover:text-green-950">
                                Login Now!!
                            </span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
