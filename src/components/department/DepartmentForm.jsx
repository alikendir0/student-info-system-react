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

function DepartmentForm({ isOpen, onClose, onDepartmentAdded, Toast }) {
  const [departmentData, setDepartmentData] = useState({
    name: "",
    facultyID: "",
    abbreviation: "",
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
      .post("http://localhost:3000/department", departmentData)
      .then((response) => {
        onDepartmentAdded();
        Toast("Başarıyla Eklendi!", "success");
      })
      .catch((error) => {
        Toast(error.response.data.message, "error");
        console.error(error);
      });
  };

  const handleInputChange = (e, property) => {
    const value = e.target.value;
    setDepartmentData({
      ...departmentData,
      [property]: value,
    });
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Bölüm Ekle</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel htmlFor="faculty-name">Fakülte</FormLabel>
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
          <FormControl>
            <FormLabel htmlFor="department-name">Bölüm Adı</FormLabel>
            <Input
              id="department-name"
              variant="filled"
              placeholder="Bölüm Adı"
              onChange={(e) => handleInputChange(e, "name")}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="department-abbreviation">
              Bölüm Kısaltması
            </FormLabel>
            <Input
              id="department-abbreviation"
              variant="filled"
              placeholder="Bölüm Kısaltması"
              onChange={(e) => handleInputChange(e, "abbreviation")}
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

export default DepartmentForm;
