import React from "react";
import { Button, Stack, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

function StudentForm({ onClose, onStudentAdded }) {
  const [studentData, setStudentData] = useState({
    name: "",
    lastName: "",
    idNo: "",
    studentNo: "",
    courses: {},
  });

  const handleAddClick = () => {
    axios
      .post("http://localhost:3000/student", studentData)
      .then((response) => {
        // Handle success
        console.log(response.data);
        if (onStudentAdded) {
          onStudentAdded(); // Call the callback function to refetch the student data
        }
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      });
  };

  const handleInputChange = (e, property) => {
    setStudentData({
      ...studentData,
      [property]: e.target.value,
    });
  };

  return (
    <Stack spacing={3}>
      <FormControl>
        <FormLabel htmlFor="student-name" textAlign={"center"}>
          Öğrenci Adı
        </FormLabel>
        <Input
          id="student-name"
          type="text"
          backgroundColor={"white"}
          textAlign={"center"}
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
          backgroundColor={"white"}
          textAlign={"center"}
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
          backgroundColor={"white"}
          textAlign={"center"}
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
          backgroundColor={"white"}
          textAlign={"center"}
          onChange={(e) => handleInputChange(e, "studentNo")}
        />
      </FormControl>
      <Button colorScheme="blue" onClick={handleAddClick}>
        Kaydet
      </Button>
      {onClose && (
        <Button colorScheme="red" onClick={onClose}>
          İptal
        </Button>
      )}
    </Stack>
  );
}

export default StudentForm;
