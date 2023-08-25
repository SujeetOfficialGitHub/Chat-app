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

import { useState } from "react";
import axios from "axios";
import {Link} from 'react-router-dom'
import { ChatState } from '../../context/ChatProvider';


const Login = () => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show)
    const toast = useToast();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false);

    // const history = useHistory()

    const {login} = ChatState();

    const submitHandler = async() => {
        setLoading(true);
        if (!email || !password){
            toast({
                title: 'Missing required fields',
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            setLoading(false);
            return;
        }
        try {
            const res = await axios.post('/api/user/login', {
                email, password
            })
            toast({
                title: "Login Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            // console.log(res)
            login(res.data.token);
            setLoading(false)
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            setLoading(false);
        }
    }
  return (
    <VStack spacing="3px" border="1px" padding="10px" maxWidth='400px' margin= '30px auto' borderRadius="5px">
        <Heading as="h3" size="lg">Login</Heading>
        <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
            />
        </FormControl>
        <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup size='md'>
                <Input
                    pr='4.5rem'
                    type={show ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Enter password'
                />
                <InputRightElement width='4.5rem'>
                    <Button h='1.75rem' size='sm' onClick={handleClick}>
                    {show ? 'Hide' : 'Show'}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <Button
            colorScheme="blue"
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
            isLoading={loading}
        >
        Login
        </Button>
        {/* <Button
            variant="solid"
            colorScheme="red"
            width="100%"
            onClick={() => {
            setEmail("guest@example.com");
            setPassword("123456");
            }}
        >
            Get Guest User Credentials
        </Button> */}
        <p style={{border: "1px solid black", padding: "5px", width: "100%", borderRadius: "5px", textAlign: 'center', marginTop: "15px"}}>
            Don't have an account <Link style={{color: "blue"}} to="/signup">Sign up here</Link>
        </p>
    </VStack>
  )
}

export default Login