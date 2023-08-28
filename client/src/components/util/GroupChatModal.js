import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  useToast,
  FormControl,
  Input,
  Box
} from '@chakra-ui/react'
import { useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';
import UserListItem from './UserListItem';
import UserBadgeItem from './UserBadgeItem';

const GroupChatModal = ({children}) => {
      const { isOpen, onOpen, onClose } = useDisclosure();
      const [groupChatName, setGroupChatName] = useState('');
      const [selectedUsers, setSelectedUsers] = useState([])
      const [searchResult, setSearchResult] = useState([])
      const [loading, setLoading] = useState(false);

      const toast = useToast()

      const {chats, setChats} = ChatState()

      const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
          toast({
            title: "User already added",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          return;
        }
    
        setSelectedUsers([...selectedUsers, userToAdd]);
      };

      // Search users to add in group 
      const handleSearch = async(query) => {
        if (!query){
          return;
        }
        try {
          setLoading(true)
          const config = {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          };
    
          const res = await axios.get(`/api/user?search=${query}`, config);
     
          // console.log(res)
          const data = await res.data;
          setLoading(false);
          setSearchResult(data)
        } catch (error) {
          console.log(error)
          toast({
            title: "Error Occured!",
            description: "Failed to Load the Search Results",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
        }
      }

      const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel.id !== delUser.id));
      };

      const handleSubmit = async() => {
        if (!groupChatName || !selectedUsers) {
          toast({
            title: "Please fill all the feilds",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          return;
        }
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          };

          const res = await axios.post(`/api/chat/group`,{
              name: groupChatName,
              users: JSON.stringify(selectedUsers.map((u) => u.id)),
            },
            config
          );
          console.log(res)
          const data = await res.data;
          setChats([data, ...chats]);
          onClose();
          toast({
            title: "New Group Chat Created!",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        } catch (error) {
          console.log(error)
          toast({
            title: "Failed to Create the Chat!",
            description: error.response.data?.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      }
      return (
        <>
          <span onClick={onOpen}>{children}</span>
    
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
                fontSize="35px"
                display="flex"
                justifyContent="center"
              >Create Group Chat</ModalHeader>
              <ModalCloseButton />
              <ModalBody
                display="flex"
                flexDir="column"
                alignItems="center"
              >
                <FormControl>
                  <Input 
                    type='text' 
                    placeholder='Chat Name' 
                    mb={3} 
                    onChange={e => setGroupChatName(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                <Input
                  placeholder="Add Users"
                  mb={1}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                </FormControl>
                <Box w="100%" d="flex" flexWrap="wrap">
                  {selectedUsers.map((u) => (
                    <UserBadgeItem
                      key={u.id}
                      user={u}
                      handleFunction={() => handleDelete(u)}
                    />
                  ))}
                </Box>
                {loading ? (
                  // <ChatLoading />
                  <div>Loading...</div>
                ) : (
                  searchResult
                    ?.slice(0, 4)
                    .map((user) => (
                      <UserListItem
                        key={user.id}
                        user={user}
                        handleFunction={() => handleGroup(user)}
                      />
                    ))
                )}
                
              </ModalBody>
    
              <ModalFooter>
              <Button onClick={handleSubmit} colorScheme="blue">
                Create Chat
              </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
  )
}

export default GroupChatModal