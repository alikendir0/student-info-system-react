import "./App.css";
import "./index.css";

import Section from "./components/section/Section.jsx";
import Student from "./components/student/Student.jsx";
import Instructor from "./components/instructor/Instructor.jsx";
import Course from "./components/course/Course.jsx";
import Faculty from "./components/faculty/Faculty.jsx";
import Login from "./components/login/Login.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Room from "./components/room/Room.jsx";

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
          <Route path="/section" element={<Section />} />
          <Route path="/course" element={<Course />} />
          <Route path="/instructor" element={<Instructor />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/room" element={<Room />} />
        </Routes>
      </Box>
    </ChakraProvider>
  );
};

export default App;
