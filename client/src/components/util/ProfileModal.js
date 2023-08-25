import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    IconButton,
    Image,
    Text
} from '@chakra-ui/react'
import {AiOutlineEye} from 'react-icons/ai';

const ProfileModal = ({children}) => {
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
            <Image
                w="150px"
                h="150px"
                borderRadius="50%"
                margin="auto"
                border="5px solid blue"
                src={'https://bit.ly/dan-abramov'} 
            />
            <Text display="flex" justifyContent="center" fontSize="20px">Sujeet</Text>
            <Text display="flex" justifyContent="center" fontSize="20px">sujeet@example.com</Text>
          </ModalBody>
        </ModalContent>
    </Modal>
    </>
  )
}

export default ProfileModal