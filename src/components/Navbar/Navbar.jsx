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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
            />
          </svg>

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
            <Button variant="ghost" onClick={() => navigate("/section")}>
              Sınıflar
            </Button>
            <Button variant="ghost" onClick={() => navigate("/instructor")}>
              Öğretim Üyeleri
            </Button>
            <Button variant="ghost" onClick={() => navigate("/faculty")}>
              Fakülteler
            </Button>
            <Button variant="ghost" onClick={() => navigate("/department")}>
              Bölümler
            </Button>
            <Button variant="ghost" onClick={() => navigate("/room")}>
              Derslikler
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
              onClick={() => navigate("/login")}
              variant="solid"
              colorScheme="teal"
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
