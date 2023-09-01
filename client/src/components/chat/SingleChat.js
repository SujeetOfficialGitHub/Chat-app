import { 
    useToast,
    FormControl,
    IconButton,
    Box,
    Text,
    Input,
    Spinner,
    FormLabel,
    Image,
    Button
} from "@chakra-ui/react";
import './styles.css'
import { useState, useEffect } from "react";
import { ChatState } from "../../context/ChatProvider";
import {AiOutlineArrowLeft} from 'react-icons/ai'
import { decodeToken } from "react-jwt";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import ProfileModal from "../util/ProfileModal";
import UpdateGroupChatModal from "../util/UpdateGroupChatModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import {BsFillImageFill} from 'react-icons/bs'


const ENDPOINT = "http://localhost:8000";
var socket, selectedChatCompare;

const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [file, setFile] = useState('');
    const [preViewImage, setPreviewImage] = useState(null)
    const [socketConnected, setSocketConnected] =    useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const toast = useToast();

    const user = decodeToken(localStorage.getItem('token'))
    const {selectedChat, setSelectedChat, notification, setNotification} = ChatState()
    

    const handleChangeFile = (e) => {
      const selectedFile = e.target.files[0];
      setNewMessage(selectedFile.name)

      if (selectedFile){
        setFile(selectedFile)

        // Check if createObjectURL is supported
        if (typeof URL.createObjectURL === 'function') {
          const imageUrl = URL.createObjectURL(selectedFile);
          setPreviewImage(imageUrl)
        } else {
          console.error('createObjectURL is not supported in this browser.');
        }
        
      }
    }

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
          // console.log(res)
          setMessages(data);
          setLoading(false);
    
          socket.emit("join chat", selectedChat.id);
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

    const sendMessage = async (event) => {
        socket.emit("stop typing", selectedChat.id);

        try {
          if (file){
            const formData = new FormData();
            formData.append('file', file); 
            
            const uploadResponse = await axios.post('/api/message/upload', formData, {
              headers: {
                "Content-type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });
            const imageUrl = await uploadResponse.data.imageUrl

            const messageResponse = await axios.post("/api/message", {
              content: imageUrl,
              messageType: 'file',
              chatId: selectedChat.id
            },{
              headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
            );
            const messageData = await messageResponse.data;
            socket.emit("new message", selectedChat.ChatUsers, messageData);
            setMessages([...messages, messageData]);
            setFile('')
            setPreviewImage('')
            setNewMessage('')
          }else if(newMessage){
            const config = {
                headers: {
                  "Content-type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              };
              const res = await axios.post(
                "/api/message",
                {
                  content: newMessage,
                  messageType: 'text',
                  chatId: selectedChat.id,
                },
                config
              );
              const data = await res.data;
              console.log(res)
              socket.emit("new message", selectedChat.ChatUsers, data);
              setMessages([...messages, data]);
              setNewMessage("");

          }
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
      // }
  };

    useEffect(() => {
      socket = io(ENDPOINT);
      socket.emit("setup", user);
      socket.on("connected", () => setSocketConnected(true));
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));
  
      // eslint-disable-next-line
    }, []);

    useEffect(() => {
        fetchMessages();
    
        selectedChatCompare = selectedChat;
        // eslint-disable-next-line
    }, [selectedChat]);    

    useEffect(() => {
        socket.on("message received", (newMessageRecieved) => {
          // console.log(newMessageRecieved)
          if (
            !selectedChatCompare || // if chat is not selected or doesn't match current chat
            selectedChatCompare.id !== newMessageRecieved.chatId
          ) {
            if (!notification.includes(newMessageRecieved)) {
              setNotification([newMessageRecieved, ...notification]);
              setFetchAgain(!fetchAgain);
            }
          } else {
            setMessages([...messages, newMessageRecieved]);
          }
        });
    });

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
    
        if (!socketConnected) return;
    
        if (!typing) {
          setTyping(true);
          socket.emit("typing", selectedChat.id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
          var timeNow = new Date().getTime();
          var timeDiff = timeNow - lastTypingTime;

          if (timeDiff >= timerLength && typing) {
            socket.emit("stop typing", selectedChat.id);
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
                {preViewImage && <Image w="50px" h="60px" src={preViewImage} />}
                {istyping ? (
                    <div className="typing-indicator-container">
                        <div className="typing-indicator">
                          <div className="dot"></div>
                          <div className="dot"></div>
                          <div className="dot"></div>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
                <Box display="flex" alignItems="center" mt={3}>
                  <FormControl w="fit-content">
                    <FormLabel padding="5px" cursor="pointer" style={{background: 'white'}}>
                      <BsFillImageFill />
                    </FormLabel>
                    <Input display="none" type='file' onChange={handleChangeFile} />
                  </FormControl>

                  <FormControl  w="100%" rounded={5} background="white" isRequired>
                    <Input onChange={typingHandler} variant="filled" bg="#E0E0E0" placeholder="Type a message.." value={newMessage} disabled={true ? file : false} />
                  </FormControl>

                  <Button onClick={sendMessage}>Send</Button>
                </Box>
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