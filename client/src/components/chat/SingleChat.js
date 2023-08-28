import { 
    useToast,
    FormControl,
    Button,
    IconButton,
    Box,
    Text
} from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import {AiOutlineArrowLeft} from 'react-icons/ai'
import { decodeToken } from "react-jwt";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import ProfileModal from "../util/ProfileModal";
import UpdateGroupChatModal from "../util/UpdateGroupChatModal";


const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] =    useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const toast = useToast();

    const user = decodeToken(localStorage.getItem('token'))
    const {selectedChat, setSelectedChat} = ChatState()
    const fetchMessages = () => {

    }
  
  return (
    <>
        {selectedChat ? (
            <>
            <Text
                fontSize={{ base: "28px", md: "30px" }}
                pb={3}
                px={2}
                w="100%"
                fontFamily="Work sans"
                disabled="flex"
                justifyContent={{ base: "space-between" }}
                alignItems="center"
            >
                <IconButton
                    disabled={{ base: "flex", md: "none" }}
                    icon={<AiOutlineArrowLeft />}
                    onClick={() => setSelectedChat("")}
                />
                {messages &&
                (!selectedChat.isGroupChat ? (
                    <>
                    {getSender(user, selectedChat.ChatUsers)}
                    <ProfileModal
                        user={getSenderFull(user, selectedChat.ChatUsers)}
                    />
                    </>
                ) : (
                    <>
                    {selectedChat.chatName.toUpperCase()}
                    <UpdateGroupChatModal
                        fetchMessages={fetchMessages}
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                    />
                    </>
                ))}
            </Text>
            </>
        ) : (
            <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                    Click on a user to start chatting
                </Text>
            </Box>
        )}
    </>
  )
}

export default SingleChat