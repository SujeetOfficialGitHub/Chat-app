import {Box} from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import SideDrawer from '../../components/util/SideDrawer'
import MyChats from '../../components/chat/MyChats'
import ChatBox from '../../components/chat/ChatBox'


const Home = () => {
  const [fetchAgain, setFetchAgain] = useState(false)
    const {isLoggedIn} = ChatState();
  return (
    <div style={{width: '100%'}}>
        {isLoggedIn && <SideDrawer />}
        <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10">
            {isLoggedIn && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            {isLoggedIn && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        </Box>
    </div>
  )
}

export default Home