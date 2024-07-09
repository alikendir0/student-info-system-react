import {
  Flex,
  Box,
  Table,
  TableCaption,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  CloseButton,
  useToast,
  Spinner,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form } from "react-router-dom";

function FacultyEdit({ isOpen, onClose, facultyData, fetchFaculties, Toast }) {
  const [faculty, setFaculty] = useState({});
  const [faculties, setFaculties] = useState([]);

  useEffect(() => {
    setFaculty(facultyData);
  }, [facultyData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFaculty({ ...faculty, [name]: value });
    console.log(faculty);
  };

  useEffect(() => {
    setFaculty(facultyData);
  }, [facultyData]);

  const updateFaculty = async () => {
    console.log(facultyData);
    try {
      const response = await axios.put(
        `http://localhost:3000/faculty/${faculty.id}`,
        faculty
      );
      if (response.status === 200) {
        onClose();
        fetchFaculties();
        Toast("Başarıyla Güncellendi!", "success");
      }
    } catch (error) {
      Toast("Hata!", "error");
      console.error("Error updating faculty:", error);
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ders Düzenle</ModalHeader>
          <ModalCloseButton />
          {faculty.id ? (
            <ModalBody>
              <FormControl id="id" mb={4}>
                <FormLabel>Faculty ID</FormLabel>
                <Input
                  disabled={true}
                  type="text"
                  name="id"
                  value={faculty.id}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl id="name" mb={4}>
                <FormLabel>Fakülte Adı</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={faculty.name}
                  onChange={handleInputChange}
                />
              </FormControl>
            </ModalBody>
          ) : (
            <Spinner />
          )}
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={updateFaculty}>
              Kaydet
            </Button>
            <Button onClick={onClose}>Kapat</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default FacultyEdit;
