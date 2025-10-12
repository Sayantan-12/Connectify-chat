import React, {useState} from "react";
import axios from 'axios';
import { toast } from 'react-toastify'
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {

  const navigate = useNavigate();
  const {setAuthUser} = useAuth();

  const [userInput, setUserInput] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInput = (e)=>{
    setUserInput({
      ...userInput, [e.target.id]: e.target.value
    })
  }
  console.log(userInput);

  const handleSubmit = async(e)=>{
    e.preventDefault();
    setLoading(true);
    try{
      const login = await axios.post('/api/auth/login', userInput, { withCredentials: true });
      const data = login.data;
      if (data.success === false) {
        setLoading(false);
        console.log(data.message);
      }
      toast.success(data.message)
      localStorage.setItem('chatapp',JSON.stringify(data));
      setAuthUser(data);
      setLoading(false);
      navigate('/');
    }
    catch(error){
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center mix-w-full mx-auto">
      <div className="w-full p-6 rounded-lg shadow-lg bg-purple-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20">
        <h1 className="text-3xl font-bold text-center text-gray-300">
          Login | <span className="text-gray-950">Connectify</span>
        </h1>
        <br />
        <br />
        <form onSubmit={handleSubmit}className="flex flex-col space-y-4">
          <input
            id="email"
            onChange={handleInput}
            type="email"
            placeholder="Email"
            className="p-3 rounded-lg bg-white/20 text-black placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-900"
            required
          />
          <input
            id="password"
            onChange={handleInput}
            type="password"
            placeholder="Password"
            className="p-3 rounded-lg bg-white/20 text-black placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-900"
          />
          <button
            className="p-3 rounded-lg bg-purple-900 hover:bg-purple-600 text-white font-semibold transition cursor-pointer"
            type="submit"
          >
            {loading ? "loading..":"Log in"}
          </button>
        </form>

        <div className="pt-2">
          <p className="text-sm font-semibold text-gray-800">
            Don't have an account?{" "}
            <Link to="/register">
              <span className="text-gray-950 font-bold underline cursor-pointer hover:text-green-950">
                Register Now!!
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
