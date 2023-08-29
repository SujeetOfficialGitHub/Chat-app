import {
  useToast, 
  Box,
  Button,
  Stack,
  Text
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';
import {AiOutlinePlus} from 'react-icons/ai'
import ChatLoading from './ChatLoading'
import { getSender } from '../../config/ChatLogics';
import { decodeToken } from "react-jwt";
import GroupChatModal from '../util/GroupChatModal';

const MyChats = ({fetchAgain}) => {
  const  [loggedUser, setLoggedUser] = useState('');
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast()

  useEffect(() => {
    const user = decodeToken(localStorage.getItem('token'))
    // console.log(user)
    setLoggedUser(user)
    const fetchChats = async() => {
      try {
        const res = await axios.get('/api/chat', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        const data = await res.data
        setChats(data)
        // console.log(res)
      } catch (error) {
        console.log(error)
        toast({
          title: "Error Occured!",
          description: "Failed to Load the chats",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
    fetchChats()
  },[fetchAgain])
  // console.log(chats)
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "20px", md: "25px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AiOutlinePlus />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>

      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat.id}
              >
                <Text>
                  {!chat.isGroupChat ? (
                    getSender(loggedUser, chat.ChatUsers)
                  ) : (chat?.chatName)}
                </Text>
              </Box>
            ))}
            
          </Stack>
        ) : (
          <ChatLoading />
        )}

      </Box>
    </Box>
  )
}

export default MyChats