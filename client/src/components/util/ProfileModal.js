import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    IconButton,
    Text,
    Avatar
} from '@chakra-ui/react'
import {AiOutlineEye} from 'react-icons/ai';

const ProfileModal = ({children, user}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
    {children ? (
        <span onClick={onOpen}>{children}</span>
    ) : (
        <IconButton display={{base: 'flex'}} icon={<AiOutlineEye/>} onClick={onOpen} />
    )}

    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />

          <ModalBody>
            <div>
                <Avatar  
                  display="flex"
                  justifyContent="center"
                  margin="auto"
                  w="100px"
                  h="100px"
                  name={user?.name}
                  border="5px solid blue"
                />
              </div>
            <Text display="flex" justifyContent="center" fontSize="20px" textTransform="capitalize">{user?.name}</Text>
            <Text display="flex" justifyContent="center" fontSize="20px">{user?.email}</Text>
          </ModalBody>
        </ModalContent>
    </Modal>
    </>
  )
}

export default ProfileModal