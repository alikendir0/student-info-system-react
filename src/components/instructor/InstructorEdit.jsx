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

function InstructorEdit({
  isOpen,
  onClose,
  instructorData,
  fetchInstructors,
  Toast,
}) {
  const [instructor, setInstructor] = useState({});
  const [faculties, setFaculties] = useState([]);

  const fetchFaculties = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/faculties`);
      const data = response.data.data;
      setFaculties(data);
    } catch (error) {
      console.error("Failed to fetch faculties:", error);
      setTimeout(fetchFaculties, 5000);
    }
  };

  useEffect(() => {
    setInstructor(instructorData);
  }, [instructorData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInstructor({ ...instructor, [name]: value });
    console.log(instructor);
  };

  useEffect(() => {
    setInstructor(instructorData);
    fetchFaculties();
  }, [instructorData]);

  const updateInstructor = async () => {
    console.log(instructorData);
    try {
      const response = await axios.put(
        `http://localhost:3000/instructor/${instructor.instructorNo}`,
        instructor
      );
      if (response.status === 200) {
        onClose();
        fetchInstructors();
        Toast("Başarıyla Güncellendi!", "success");
      }
    } catch (error) {
      Toast("Hata!", "error");
      console.error("Error updating instructor:", error);
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Öğretim Üyesi Düzenle</ModalHeader>
          <ModalCloseButton />
          {instructor.instructorNo ? (
            <ModalBody>
              <FormControl id="id" mb={4}>
                <FormLabel>Instructor ID</FormLabel>
                <Input
                  disabled={true}
                  type="text"
                  name="id"
                  value={instructor.id}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl id="firstName" mb={4}>
                <FormLabel>Ad</FormLabel>
                <Input
                  type="text"
                  name="firstName"
                  value={instructor.firstName}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl id="lastName" mb={4}>
                <FormLabel>Soyad</FormLabel>
                <Input
                  type="text"
                  name="lastName"
                  value={instructor.lastName}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl id="gender" mb={4}>
                <FormLabel htmlFor="instructor-gender">Cinsiyet</FormLabel>
                <Select
                  id="gender-select"
                  variant="filled"
                  name="gender"
                  value={instructor.gender}
                  onChange={handleInputChange}
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
              <FormControl id="instructorNo" mb={4}>
                <FormLabel>Öğretim Üyesi Numarası</FormLabel>
                <Input
                  disabled={true}
                  type="text"
                  name="instructorNo"
                  value={instructor.instructorNo}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="instructor-faculty">Fakülte</FormLabel>
                <Select
                  id="faculty-select"
                  variant="filled"
                  name="facultyID"
                  value={instructor.facultyID}
                  onChange={handleInputChange}
                >
                  {faculties.map((faculty) => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </ModalBody>
          ) : (
            <Spinner />
          )}
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={updateInstructor}>
              Kaydet
            </Button>
            <Button onClick={onClose}>Kapat</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default InstructorEdit;
