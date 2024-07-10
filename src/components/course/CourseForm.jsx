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
  Textarea,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";

function CourseForm({ isOpen, onClose, onCourseAdded, Toast }) {
  const [courseData, setCourseData] = useState({
    facultyID: "",
    code: "",
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
      .post("http://localhost:3000/course", courseData)
      .then((response) => {
        console.log(response.data);
        onCourseAdded();
        Toast("Başarıyla Eklendi!", "success");
      })
      .catch((error) => {
        Toast(error.response.data.message, "error");
        console.error(error);
      });
  };

  const handleInputChange = (e, property) => {
    const value = e.target.value;
    setCourseData({
      ...courseData,
      [property]: value,
    });
  };

  useEffect(() => {
    fetchFaculties();
    console.log(courseData);
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Öğretim Üyesi Ekle</ModalHeader>
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
            <FormLabel htmlFor="course-code">Ders Kodu</FormLabel>
            <Input
              id="course-code"
              variant="filled"
              placeholder="Ders Kodu"
              onChange={(e) => handleInputChange(e, "code")}
            />
          </FormControl>
          <FormControl id="name" mb={4}>
            <FormLabel>Ad</FormLabel>
            <Input
              type="text"
              variant="filled"
              onChange={(e) => handleInputChange(e, "name")}
            />
          </FormControl>
          <FormControl id="description" mb={4}>
            <FormLabel>Açıklama</FormLabel>
            <Textarea
              type="text"
              variant="filled"
              onChange={(e) => handleInputChange(e, "description")}
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

export default CourseForm;
