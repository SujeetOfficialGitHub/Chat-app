import { 
    useToast,
    FormControl,
    Button,
    IconButton,
    Box,
    Text,
    Input,
    Spinner
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { ChatState } from "../../context/ChatProvider";
import {AiOutlineArrowLeft} from 'react-icons/ai'
import { decodeToken } from "react-jwt";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import ProfileModal from "../util/ProfileModal";
import UpdateGroupChatModal from "../util/UpdateGroupChatModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";

const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] =    useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const toast = useToast();

    const user = decodeToken(localStorage.getItem('token'))
    const {selectedChat, setSelectedChat, notification, setNotification} = ChatState()
    

    const fetchMessages = async () => {
        if (!selectedChat) return;
    
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          };
    
          setLoading(true);
    
          const res = await axios.get( `/api/message/${selectedChat.id}`,
            config
          );
          const data = await res.data;
        //   console.log(res)
          setMessages(data);
          setLoading(false);
    
        //   socket.emit("join chat", selectedChat.id);
        } catch (error) {
            console.log(error)
          toast({
            title: "Error Occured!",
            description: "Failed to Load the Messages",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
    };
    useEffect(() => {
        fetchMessages();
    
        // selectedChatCompare = selectedChat;
        // eslint-disable-next-line
    }, [selectedChat]);


    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
        //   socket.emit("stop typing", selectedChat.id);
          try {
            const config = {
              headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            };
            setNewMessage("");
            const res = await axios.post(
              "/api/message",
              {
                content: newMessage,
                chatId: selectedChat.id,
              },
              config
            );
            const data = await res.data;
            console.log(res)
            // socket.emit("new message", data);
            setMessages([...messages, data]);
          } catch (error) {
            console.log(error)
            toast({
              title: "Error Occured!",
              description: "Failed to send the Message",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
          }
        }
    };
    
    
    //   useEffect(() => {
    //     socket = io(ENDPOINT);
    //     socket.emit("setup", user);
    //     socket.on("connected", () => setSocketConnected(true));
    //     socket.on("typing", () => setIsTyping(true));
    //     socket.on("stop typing", () => setIsTyping(false));
    
    //     // eslint-disable-next-line
    //   }, []);

    

    // useEffect(() => {
    //     socket.on("message recieved", (newMessageRecieved) => {
    //       if (
    //         !selectedChatCompare || // if chat is not selected or doesn't match current chat
    //         selectedChatCompare._id !== newMessageRecieved.chat._id
    //       ) {
    //         if (!notification.includes(newMessageRecieved)) {
    //           setNotification([newMessageRecieved, ...notification]);
    //           setFetchAgain(!fetchAgain);
    //         }
    //       } else {
    //         setMessages([...messages, newMessageRecieved]);
    //       }
    //     });
    //   });

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
    
        if (!socketConnected) return;
    
        // if (!typing) {
        //   setTyping(true);
        //   socket.emit("typing", selectedChat.id);
        // }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
          var timeNow = new Date().getTime();
          var timeDiff = timeNow - lastTypingTime;
          if (timeDiff >= timerLength && typing) {
            // socket.emit("stop typing", selectedChat.id);
            setTyping(false);
          }
        }, timerLength);
    };
  
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
            <Box
                display="flex"
                flexDir="column"
                justifyContent="flex-end"
                p={3}
                bg="blue.900"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
            >
                {loading ? (
                <Spinner
                    size="xl"
                    w={20}
                    h={20}
                    alignSelf="center"
                    margin="auto"
                />
                ) : (
                <div className="messages">
                    <ScrollableChat messages={messages} loggedUser={user} />
                </div>
                )}

                <FormControl
                    onKeyDown={sendMessage}
                    id="first-name"
                    background="white"
                    rounded={5}
                    isRequired
                    mt={3}
                >
                {istyping ? (
                    <div>
                    {/* <Lottie
                        options={defaultOptions}
                        // height={50}
                        width={70}
                        style={{ marginBottom: 15, marginLeft: 0 }}
                    /> */}
                    </div>
                ) : (
                    <></>
                )}
                <Input
                    variant="filled"
                    bg="#E0E0E0"
                    placeholder="Enter a message.."
                    value={newMessage}
                    onChange={typingHandler}
                />
                </FormControl>
            </Box>
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