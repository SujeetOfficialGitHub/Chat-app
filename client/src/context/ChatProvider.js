import React, {createContext, useContext, useState} from 'react'

const ChatContext = createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => {},
    logout: () => {}
})

const ChatProvider = ({children}) => {
  const initialToken = localStorage.getItem('token');
  const [token, setToken] = useState(initialToken)

  const isLoggedIn = !!token
  const handleLogin = (token) => {
    setToken(token)
    localStorage.setItem('token', token)
  }
  const handleLogout = () => {
    setToken('')
    localStorage.removeItem('token')
  }


  const chatValue = {
    token: token,
    isLoggedIn: isLoggedIn,
    login: handleLogin,
    logout: handleLogout
  }
  return (
    <ChatContext.Provider value={chatValue}>
        {children}
    </ChatContext.Provider>
  )
}

export const ChatState = () => {
  return useContext(ChatContext)
}

export default ChatProvider