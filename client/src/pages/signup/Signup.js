import React, { useState } from 'react'
import CustomInput from '../../components/util/CustomInput'
import CustomButton from '../../components/util/CustomButton';
import {Link} from 'react-router-dom'
import axios from 'axios';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('')
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSignup = async(e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/user/signup', {
                name, email, password1, password2
            })
            // console.log(res)
            setMessage(res?.data?.message)
            setName('')
            setEmail('')
        } catch (error) {
            // console.log(error)
            setError(error?.response?.data?.message)
        }
        setPassword1('')
        setPassword2('')
    }
    if (message || error){
        setTimeout(() => {
            setMessage('')
            setError('')
        }, 10000)
    }
  return (
    <div className='border-2 p-3 mt-10 mx-auto max-w-sm rounded'>
        <h1 className='font-bold text-center pb-2'>Sign Up</h1>
        {message && <p className='text-center bg-[green] text-white'>{message}</p>}
        {error && <p className='text-center bg-[red] text-white'>{error}</p>}
        <hr />
        <form onSubmit={handleSignup}>
            <CustomInput 
                label="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="name"
                placeholder="Enter your name"
                inputClass="border-2 w-full rounded px-1 mb-3"
                required
            />
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
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                id="password1"
                placeholder="Enter password"
                inputClass="border-2 w-full rounded px-1 mb-3"
                required
            />
            <CustomInput 
                label="Confirm password"
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                id="password2"
                placeholder="Enter confirm password"
                inputClass="border-2 w-full rounded px-1 mb-3"
                required
            />
            <CustomButton
                type="submit"
                btnClass="border-2 w-full bg-[green] text-white rounded"
            >
                Signup
            </CustomButton>
        </form>
        <p className='w-full border-2 mt-3 text-center'>Already have an account. <br /> Please <Link className='text-[#1d4ed8]' to="/login">Login here</Link></p>
    </div>
  )
}

export default Signup