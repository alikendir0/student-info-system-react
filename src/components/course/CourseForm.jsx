import React from "react";
import {
  Button,
  Stack,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

function CourseForm({ onClose, onCourseAdded }) {
  const [courseData, setCourseData] = useState({
    code: "",
    faculty: "",
    time: "",
    place: "",
    instructor: "",
  });

  const handleAddClick = () => {
    axios
      .post("http://localhost:3000/course", courseData)
      .then((response) => {
        // Handle success
        console.log(response.data);
        onCourseAdded();
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      });
  };

  const handleInputChange = (e, property) => {
    setCourseData({
      ...courseData,
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
        <FormLabel htmlFor="course-code" textAlign={"center"}>
          Ders Kodu
        </FormLabel>
        <Input
          id="course-code"
          type="text"
          colorScheme="teal"
          textAlign={"center"}
          borderWidth="2px"
          onChange={(e) => handleInputChange(e, "code")}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="course-faculty" textAlign={"center"}>
          Fakülte
        </FormLabel>
        <Input
          id="course-faculty"
          type="text"
          colorScheme="teal"
          textAlign={"center"}
          borderWidth="2px"
          onChange={(e) => handleInputChange(e, "faculty")}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="course-time" textAlign={"center"}>
          Zaman
        </FormLabel>
        <Input
          id="course-time"
          type="text"
          colorScheme="teal"
          textAlign={"center"}
          borderWidth="2px"
          onChange={(e) => handleInputChange(e, "time")}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="course-place" textAlign={"center"}>
          Sınıf
        </FormLabel>
        <Input
          id="course-place"
          type="text"
          colorScheme="teal"
          textAlign={"center"}
          borderWidth="2px"
          onChange={(e) => handleInputChange(e, "place")}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="course-instructor" textAlign={"center"}>
          Öğretim Görevlisi
        </FormLabel>
        <Input
          id="course-instructor"
          type="text"
          colorScheme="teal"
          textAlign={"center"}
          borderWidth="2px"
          onChange={(e) => handleInputChange(e, "instructor")}
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

export default CourseForm;
