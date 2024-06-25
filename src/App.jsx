import "./App.css";
import "./index.css";

import Course from "./components/course/Course.jsx";
import Student from "./components/student/Student.jsx";
import Login from "./components/login/Login.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";

import { Routes, Route, useNavigate } from "react-router-dom";
import { ChakraProvider, Box, Flex } from "@chakra-ui/react";

const App = () => {
  return (
    <ChakraProvider>
      <Box pt="20px">
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/student" element={<Student />} />
          <Route path="/course" element={<Course />} />
        </Routes>
      </Box>
    </ChakraProvider>
  );
};

export default App;
