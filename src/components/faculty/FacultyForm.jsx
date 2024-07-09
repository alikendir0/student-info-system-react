import React from "react";
import {
  Button,
  Stack,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";

function FacultyForm({ isOpen, onClose, onFacultyAdded, Toast }) {
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Fakülte Ekle</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel htmlFor="faculty-name">Fakülte Adı</FormLabel>
            <Input
              id="faculty-name"
              placeholder="Fakülte Adı"
              onChange={(e) => handleInputChange(e, "name")}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="solid"
            colorScheme="teal"
            onClick={handleAddClick}
            mr={3}
          >
            Ekle
          </Button>
          {onClose && (
            <Button variant="solid" onClick={onClose}>
              İptal
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default FacultyForm;
