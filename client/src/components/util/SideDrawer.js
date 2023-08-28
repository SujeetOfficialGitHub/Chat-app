import { 
  Box, 
  Tooltip, 
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,

  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,

  Input,
  useToast,
  Spinner
} from '@chakra-ui/react'
import React, { useState } from 'react'
import {FiSearch} from 'react-icons/fi'
import {AiFillBell} from 'react-icons/ai'
import {IoMdArrowDropdown} from 'react-icons/io'
import { ChatState } from '../../context/ChatProvider'
import ProfileModal from './ProfileModal'
import axios from 'axios'
import ChatLoading from '../chat/ChatLoading'
import UserListItem from './UserListItem'

const SideDrawer = () => {
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false)

  const { isOpen, onOpen, onClose } = useDisclosure()

  const {logout, setSelectedChat, notification, setNotification, chats, setChats} = ChatState();
  const toast = useToast()

  const handleSearch = async() => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      const res = await axios.get(`/api/user?search=${search}`, config);
      // console.log(res)
      setLoading(false);
      setSearchResult(res.data);
    } catch (error) {
      console.log(error)
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  // Access chat of selected user 
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const res = await axios.post(`/api/chat`, { userId }, config);
      const data = await res.data;
      console.log(res)
      if (!chats.find((c) => c.id === data.id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      console.log(error)
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
    <Box  
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bg="white"
      w="100%"
      p="5px 10px 5px 10px"
      borderWidth="5px"
    >
      <Tooltip label="Search users" hasArrow placement="bottom-end">
        <Button variant="ghost" onClick={onOpen}>
          <FiSearch/>
          <Text display={{ base: "none", md: "flex" }} px={4}>Search User</Text>
        </Button>
      </Tooltip>
      <Text fontSize="2xl">
        Chat App
      </Text>
      <div>
        <Menu>
          <MenuButton>
            <AiFillBell fontSize='2xl' m={1} />
          </MenuButton>
          {/* <MenuList></MenuList> */}
        </Menu>
        <Menu>
          <MenuButton as={Button} rightIcon={<IoMdArrowDropdown/>}>
          <Avatar size="sm" name='Dan Abrahmov' src={'https://bit.ly/dan-abramov'} />
          </MenuButton>
          <MenuList>
            <ProfileModal>
              <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <MenuItem onClick={() => logout()}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </Box>

    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search New Users</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2} >
              <Input placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch} >Go</Button>
            </Box>

            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user.id}
                  user={user}
                  handleFunction={() => accessChat(user.id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>

        </DrawerContent>
    </Drawer>
    </>
  )
}

export default SideDrawer