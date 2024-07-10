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

function InstructorForm({ isOpen, onClose, onInstructorAdded, Toast }) {
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Öğretim Üyesi Ekle</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="firstName" mb={4}>
            <FormLabel htmlFor="instructor-name">Öğretim Üyesi Adı</FormLabel>
            <Input
              id="instructor-name"
              type="text"
              colorScheme="teal"
              onChange={(e) => handleInputChange(e, "firstName")}
            />
          </FormControl>
          <FormControl id="lastName" mb={4}>
            <FormLabel htmlFor="instructor-lastname">
              Öğretim Üyesi Soyadı
            </FormLabel>
            <Input
              id="instructor-name"
              type="text"
              colorScheme="teal"
              onChange={(e) => handleInputChange(e, "lastName")}
            />
          </FormControl>
          <FormControl id="gender" mb={4}>
            <FormLabel htmlFor="student-gender">Cinsiyet</FormLabel>
            <Select
              placeholder="Cinsiyet Seçiniz"
              id="student-gender"
              type="text"
              colorScheme="teal"
              onChange={(e) => handleInputChange(e, "gender")}
            >
              <option key={"M"} value={"M"}>
                Erkek
              </option>
              <option key={"F"} value={"F"}>
                Kadın
              </option>
              <option key={"O"} value={"O"}>
                Diğer
              </option>
            </Select>
          </FormControl>
          <FormControl id="id" mb={4}>
            <FormLabel htmlFor="instructor-id">T.C. Kimlik Numarası</FormLabel>
            <Input
              id="instructor-id"
              type="text"
              colorScheme="teal"
              onChange={(e) => handleInputChange(e, "id")}
            />
          </FormControl>
          <FormControl id="instructorNo" mb={4}>
            <FormLabel htmlFor="instructor-no">
              Öğretim Üyesi Numarası
            </FormLabel>
            <Input
              id="instructor-no"
              type="text"
              colorScheme="teal"
              onChange={(e) => handleInputChange(e, "instructorNo")}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="instructor-faculty">Fakülte</FormLabel>
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

export default InstructorForm;
