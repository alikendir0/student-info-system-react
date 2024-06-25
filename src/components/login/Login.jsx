import React from "react";
import {
  ChakraProvider,
  Box,
  Heading,
  Text,
  Button,
  Center,
  Flex,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <Center h="70vh">
      <Flex>
        <Box p={8} textAlign="center">
          <Heading mb={4}>Öğrenci Bilgi Sistemine Hoş Geldiniz!</Heading>
          <Button onClick={() => navigate("/student")} colorScheme="teal">
            Giriş
          </Button>
        </Box>
      </Flex>
    </Center>
  );
};

export default Login;
