import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { Box, Avatar } from '@chakra-ui/react';
import './styles.css';

const ScrollableChat = ({ messages, loggedUser }) => {
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div key={m.id} className={`message-container ${loggedUser.id === m.sender.id ? 'right' : 'left'}`}>
            <Box
              px={1}
              mb={1}
              borderRadius="md"
              // maxWidth="fit-content"
              backgroundColor={loggedUser.id === m.sender.id ? 'green.600' : 'blue.800'}
              color="white"
              alignSelf={loggedUser.id === m.sender.id ? 'flex-end' : 'flex-start'}
              borderColor={loggedUser.id === m.sender.id ? 'green.500' : 'red.500'}
              mr={loggedUser.id === m.sender.id ? '0px' : '70px'}
              ml={loggedUser.id === m.sender.id ? '70px' : '0px'}
              borderWidth={1}
              className="message-box"
            >
                <div style={{display: 'flex'}} >
                  <Avatar size="sm" name={m.sender.name}/>
                  <p style={{fontSize: '15px', marginLeft: '5px', alignItems: 'center', display: 'flex', textTransform: 'capitalize'}}><b>{m.sender.name}</b></p>
                </div>
                <p style={{marginLeft: '6px'}}>{m.content}</p>
            </Box>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
