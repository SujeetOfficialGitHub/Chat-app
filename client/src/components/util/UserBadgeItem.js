// import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/react";
import {RxCross2} from 'react-icons/rx'

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Badge
          display="inline-flex"
        w="fit-content"
        alignItems="center"
        px={2}
        py={1}
        borderRadius="lg"
        m={1}
        mb={2}
        variant="solid"
        fontSize={12}
        colorScheme="purple"
        cursor="pointer"
        onClick={handleFunction}
    >
        {user.name}
        <RxCross2 style={{marginLeft: '5px', alignItems: "center"}} />
    </Badge>
  );
};

export default UserBadgeItem;