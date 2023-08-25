import React, { useState } from 'react'
import CustomInput from '../../components/util/CustomInput'
import CustomButton from '../../components/util/CustomButton';
import {Link} from 'react-router-dom'
import axios from 'axios';
import { ChatState } from '../../context/ChatProvider';

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const {login} = ChatState();

    const handleLogin = async(e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/user/login', {
                email, password
            })
            setMessage(res.data.message)
            setEmail('')
            login(res.data.token)
        } catch (error) {
            // console.log(error)
            setError(error?.response?.data?.message)
        }
        setPassword('')
    }
    if (message || error){
        setTimeout(() => {
            setMessage('')
            setError('')
        }, 10000)
    }
  return (
    <div className='border-2 p-3 mt-10 mx-auto max-w-sm rounded'>
        <h1 className='font-bold text-center pb-2'>Login</h1>
        {message && <p className='text-center bg-[green] text-white'>{message}</p>}
        {error && <p className='text-center bg-[red] text-white'>{error}</p>}
        <hr />
        <form onSubmit={handleLogin}>
            <CustomInput 
                label="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                placeholder="Enter your email"
                inputClass="border-2 w-full rounded px-1 mb-3"
                required
            />
            <CustomInput 
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                placeholder="Enter your password"
                inputClass="border-2 w-full rounded px-1 mb-3"
                required
            />
            <Link className='text-[#1d4ed8]' to="/forgot-password">Forgot Password</Link>
            <br />
            <CustomButton
                type="submit"
                btnClass="border-2 w-full bg-[green] text-white rounded"
            >
                Login
            </CustomButton>
        </form>
        <p className='w-full border-2 mt-3 text-center'>Don't have an account. <br /> Please <Link className='text-[#1d4ed8]' to="/signup">Signup here</Link></p>
    </div>
  )
}

export default Login