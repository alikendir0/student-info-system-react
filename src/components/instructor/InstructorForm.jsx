import React from "react";
import {
  Button,
  Stack,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
  Select,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";

function InstructorForm({ onClose, onInstructorAdded, Toast }) {
  const [instructorData, setInstructorData] = useState({
    id: "",
    instructorNo: "",
    firstName: "",
    lastName: "",
    facultyID: "",
  });
  const [faculties, setFaculties] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchFaculties = async () => {
    setIsLoaded(false);
    try {
      const response = await axios.get(`http://localhost:3000/faculties`);
      const data = response.data.data;
      setFaculties(data);
      setIsLoaded(true);
    } catch (error) {
      console.error("Failed to fetch faculties:", error);
      setTimeout(fetchFaculties, 5000);
    }
  };

  const handleAddClick = () => {
    console.log(instructorData);
    axios
      .post("http://localhost:3000/instructor", instructorData)
      .then((response) => {
        console.log(response.data);
        onInstructorAdded();
        Toast("Başarıyla Eklendi!", "success");
      })
      .catch((error) => {
        Toast(error.response.data.message, "error");
        console.error(error);
      });
  };

  const handleInputChange = (e, property) => {
    const value = e.target.value;
    setInstructorData({
      ...instructorData,
      [property]: value,
    });
    console.log(instructorData);
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  return (
    <Stack
      bg={useColorModeValue("gray.100", "gray.900")}
      spacing={3}
      borderRadius={"md"}
      p={2}
    >
      <FormControl>
        <FormLabel htmlFor="instructor-name" textAlign={"center"}>
          Öğretim Üyesi Adı
        </FormLabel>
        <Input
          id="instructor-name"
          type="text"
          colorScheme="teal"
          textAlign={"center"}
          borderWidth="2px"
          onChange={(e) => handleInputChange(e, "firstName")}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="instructor-lastname" textAlign={"center"}>
          Öğretim Üyesi Soyadı
        </FormLabel>
        <Input
          id="instructor-name"
          type="text"
          colorScheme="teal"
          textAlign={"center"}
          borderWidth="2px"
          onChange={(e) => handleInputChange(e, "lastName")}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="instructor-id" textAlign={"center"}>
          T.C. Kimlik Numarası
        </FormLabel>
        <Input
          id="instructor-id"
          type="text"
          colorScheme="teal"
          textAlign={"center"}
          borderWidth="2px"
          onChange={(e) => handleInputChange(e, "id")}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="instructor-no" textAlign={"center"}>
          Öğretim Üyesi Numarası
        </FormLabel>
        <Input
          id="instructor-no"
          type="text"
          colorScheme="teal"
          textAlign={"center"}
          borderWidth="2px"
          onChange={(e) => handleInputChange(e, "instructorNo")}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="instructor-id" textAlign={"center"}>
          Fakülte
        </FormLabel>
        <Select
          id="faculty-select"
          variant="filled"
          placeholder="Fakülte"
          onChange={(e) => handleInputChange(e, "facultyID")}
        >
          {faculties.map((faculty) => (
            <option key={faculty.id} value={faculty.id}>
              {faculty.name}
            </option>
          ))}
        </Select>
      </FormControl>
      <Button variant="solid" colorScheme="teal" onClick={handleAddClick}>
        Ekle
      </Button>
      {onClose && (
        <Button variant="solid" colorScheme="teal" onClick={onClose}>
          İptal
        </Button>
      )}
    </Stack>
  );
}

export default InstructorForm;
