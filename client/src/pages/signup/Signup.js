import {
    FormControl, 
    FormLabel, 
    Button,
    Input, 
    InputGroup, 
    InputRightElement,
    VStack, 
    useToast, 
    Heading
} from '@chakra-ui/react'

import axios from 'axios';
import { useState } from 'react';
import {useNavigate, Link} from 'react-router-dom'

const Signup = () => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const toast = useToast();

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const submitHandler = async() => {
        setLoading(true);
        if (!name || !email || !password1 || !password2){
            toast({
                title: "Missing Required Fileds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            setLoading(false)
            return;
        }else if (password1 !== password2){
            toast({
                title: "Password and confirm password didn't match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            setLoading(false)
            return;
        }
        try {
            const res = await axios.post('/api/user/signup', {
                name, email, password1, password2
            });
            // console.log(res)
            toast({
                title: res.data?.message,
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            setLoading(false)
            navigate('/login')
        } catch (error) {
            // console.log(error)
            toast({
                title: error.response?.data?.message,
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            setLoading(false)
        }
    }


    return (
        <VStack spacing="3px" border="1px" padding="10px" maxWidth='400px' margin= '30px auto' borderRadius="5px">
        <Heading as="h3" size="lg">Sign Up</Heading>
        <FormControl id="name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input
                placeholder="Enter Your Name"
                onChange={(e) => setName(e.target.value)}
            />
        </FormControl>
        <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
                type="email"
                placeholder="Enter Your Email"
                onChange={(e) => setEmail(e.target.value)}
            />
        </FormControl>
        <FormControl id="password1" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup size="md">
                <Input
                    type={show ? "text" : "password"}
                    placeholder="Enter Password"
                    value={password1}
                    onChange={(e) => setPassword1(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id="password2" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup size="md">
                <Input
                    type={show ? "text" : "password"}
                    placeholder="Confirm password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <Button
            colorScheme="blue"
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
        >
            Sign Up
        </Button>
        <p style={{border: "1px solid black", padding: "5px", width: "100%", borderRadius: "5px", textAlign: 'center', marginTop: "15px"}}>
            Already have an account <Link style={{color: "blue"}} to="/login">Login here</Link>
        </p>
    </VStack>
  )
}

export default Signup