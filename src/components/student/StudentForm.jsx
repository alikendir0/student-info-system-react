import React from "react";
import {
  Button,
  Stack,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
  useColorMode,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

function StudentForm({ onClose, onStudentAdded, Toast }) {
  const [studentData, setStudentData] = useState({
    name: "",
    lastName: "",
    idNo: "",
    studentNo: "",
    courses: [],
  });

  const handleAddClick = () => {
    axios
      .post("http://localhost:3000/student", studentData)
      .then((response) => {
        console.log(response.data);
        onStudentAdded();
        Toast("Başarıyla Eklendi!", "success");
      })
      .catch((error) => {
        Toast(error.response.data.data[0].message, "error");
      });
  };

  const handleInputChange = (e, property) => {
    setStudentData({
      ...studentData,
      [property]: e.target.value,
    });
  };

  return (
    <Stack
      bg={useColorModeValue("gray.100", "gray.900")}
      spacing={3}
      borderRadius={"md"}
      p={2}
    >
      <FormControl>
        <FormLabel htmlFor="student-name" textAlign={"center"}>
          Öğrenci Adı
        </FormLabel>
        <Input
          id="student-name"
          type="text"
          colorScheme="teal"
          textAlign={"center"}
          borderWidth="2px"
          onChange={(e) => handleInputChange(e, "name")}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="student-lastname" textAlign={"center"}>
          Öğrenci Soyadı
        </FormLabel>
        <Input
          id="student-name"
          type="text"
          colorScheme="teal"
          textAlign={"center"}
          borderWidth="2px"
          onChange={(e) => handleInputChange(e, "lastName")}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="student-id" textAlign={"center"}>
          T.C. Kimlik Numarası
        </FormLabel>
        <Input
          id="student-id"
          type="text"
          colorScheme="teal"
          textAlign={"center"}
          borderWidth="2px"
          onChange={(e) => handleInputChange(e, "idNo")}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="student-no" textAlign={"center"}>
          Öğrenci Numarası
        </FormLabel>
        <Input
          id="student-no"
          type="text"
          colorScheme="teal"
          textAlign={"center"}
          borderWidth="2px"
          onChange={(e) => handleInputChange(e, "studentNo")}
        />
      </FormControl>
      <Button variant="solid" colorScheme="teal" onClick={handleAddClick}>
        Kaydet
      </Button>
      {onClose && (
        <Button variant="solid" colorScheme="teal" onClick={onClose}>
          İptal
        </Button>
      )}
    </Stack>
  );
}

export default StudentForm;
