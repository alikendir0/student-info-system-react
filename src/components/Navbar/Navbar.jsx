import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
} from "@chakra-ui/react";

const Navbar = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  const signOut = async () => {
    navigate("/login");
  };

  return (
    <Box
      bg={useColorModeValue("gray.100", "gray.900")}
      px={4}
      pos="fixed"
      w="100%"
      zIndex="999"
      top={0}
      left={0}
      position={"sticky"}
    >
      <Flex
        h={16}
        alignItems="center"
        justifyContent="space-between"
        maxW="7xl"
        mx="auto"
      >
        <HStack spacing={8} alignItems="center">
          <Text fontSize="xl">Logo</Text>
          <HStack as="nav" spacing={4} display={{ base: "none", md: "flex" }}>
            <Button variant="ghost" onClick={() => navigate("/")}>
              Ana Sayfa
            </Button>
            <Button variant="ghost" onClick={() => navigate("/student")}>
              Öğrenciler
            </Button>
            <Button variant="ghost" onClick={() => navigate("/course")}>
              Dersler
            </Button>
          </HStack>
        </HStack>
        <HStack spacing={4} alignItems="center">
          (
          <Menu>
            <MenuButton
              as={Button}
              rounded="full"
              variant="link"
              cursor="pointer"
              minW="0"
            >
              <Avatar size="sm" />
            </MenuButton>
            <MenuList>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem onClick={toggleColorMode}>
                {colorMode === "light" ? "Dark" : "Light"} Mode
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={signOut}>Sign out</MenuItem>
            </MenuList>
          </Menu>
          ) : (
          <>
            <Button
              onClick={() => navigate("/register")}
              variant="solid"
              colorScheme="teal"
            >
              Kayıt Ol
            </Button>
            <Button
              onClick={() => navigate("/login")}
              variant="solid"
              colorScheme="blue"
            >
              Giriş Yap
            </Button>
          </>
          )
        </HStack>
      </Flex>
      {isOpen && (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as="nav" spacing={4}>
            <Button variant="ghost">Home</Button>
            <Button variant="ghost">About</Button>
            <Button variant="ghost">Services</Button>
            <Button variant="ghost">Contact</Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default Navbar;
