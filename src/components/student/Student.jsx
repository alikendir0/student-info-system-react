import Table from "./StudentTable.jsx";
import StudentControls from "./StudentControls.jsx";

import { Box, Flex } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";

function Student() {
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/students`);
      const data = response.data.data;
      setStudents(data);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);
  return (
    <>
      <Flex direction="column" align="right">
        <Box position={"absolute"} alignSelf="flex-end" mb={-10}>
          <StudentControls onStudentAdded={fetchStudents} />
        </Box>
        <Table students={students} />
      </Flex>
    </>
  );
}

export default Student;
