import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { Box } from '@chakra-ui/react';
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
              maxWidth="fit-content"
              backgroundColor={loggedUser.id === m.sender.id ? 'green.600' : 'blue.800'}
              color="white"
              alignSelf={loggedUser.id === m.sender.id ? 'flex-end' : 'flex-start'}
              borderColor={loggedUser.id === m.sender.id ? 'green.500' : 'red.500'}
              borderWidth={1}
              className="message-box"
            >
                <p style={{fontSize: '13px'}}
                ><b>{m.sender.name}</b></p>
                <p style={{marginLeft: '6px', marginTop: '-4px'}}>{m.content}</p>
            </Box>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
