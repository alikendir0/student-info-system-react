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

function FacultyForm({ onClose, onFacultyAdded, Toast }) {
  const [facultyData, setFacultyData] = useState({
    name: "",
  });
  const [selectedFaculty, setSelectedFaculty] = useState(null);
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
    axios
      .post("http://localhost:3000/faculty", facultyData)
      .then((response) => {
        console.log(response.data);
        onFacultyAdded();
        Toast("Başarıyla Eklendi!", "success");
      })
      .catch((error) => {
        Toast(error.response.data.message, "error");
        console.error(error);
      });
  };

  const handleInputChange = (e, property) => {
    const value = e.target.value;
    setFacultyData({
      ...facultyData,
      [property]: value,
    });
  };

  useEffect(() => {
    fetchFaculties();
    console.log(facultyData);
  }, []);

  return (
    <Stack
      bg={useColorModeValue("gray.100", "gray.900")}
      spacing={3}
      borderRadius={"md"}
      p={2}
    >
      <FormControl>
        <FormLabel htmlFor="faculty-name" textAlign={"center"}>
          Fakülte Adı
        </FormLabel>
        <Input
          id="faculty-name"
          placeholder="Fakülte Adı"
          onChange={(e) => handleInputChange(e, "name")}
        />
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

export default FacultyForm;
