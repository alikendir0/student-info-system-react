import React from "react";
import {
  Button,
  Stack,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
  useColorMode,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

function StudentForm({ isOpen, onClose, onStudentAdded, Toast }) {
  const [studentData, setStudentData] = useState({
    firstName: "",
    lastName: "",
    id: "",
    studentNo: "",
    departmentID: "",
  });
  const [departments, setDepartments] = useState([]);

  const handleAddClick = () => {
    console.log(studentData);
    axios
      .post("http://localhost:3000/student", studentData)
      .then((response) => {
        console.log(response.data);
        onStudentAdded();
        Toast("Başarıyla Eklendi!", "success");
      })
      .catch((error) => {
        Toast(error.response.data.message, "error");
      });
  };

  const handleInputChange = (e, property) => {
    setStudentData({
      ...studentData,
      [property]: e.target.value,
    });
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/departments`);
      const data = response.data.data;
      setDepartments(data);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      setTimeout(fetchDepartments, 5000);
    }
  };

  useState(() => {
    fetchDepartments();
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Öğrenci Ekle</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="firstName" mb={4}>
            <FormLabel htmlFor="student-firstName">Öğrenci Adı</FormLabel>
            <Input
              id="student-firstName"
              type="text"
              colorScheme="teal"
              onChange={(e) => handleInputChange(e, "firstName")}
            />
          </FormControl>
          <FormControl id="lastName" mb={4}>
            <FormLabel htmlFor="student-lastName">Öğrenci Soyadı</FormLabel>
            <Input
              id="student-lastName"
              type="text"
              colorScheme="teal"
              onChange={(e) => handleInputChange(e, "lastName")}
            />
          </FormControl>
          <FormControl id="id" mb={4}>
            <FormLabel htmlFor="student-id">T.C. Kimlik Numarası</FormLabel>
            <Input
              id="student-id"
              type="text"
              colorScheme="teal"
              onChange={(e) => handleInputChange(e, "id")}
            />
          </FormControl>
          <FormControl id="studentNo" mb={4}>
            <FormLabel htmlFor="student-studentNo">Öğrenci Numarası</FormLabel>
            <Input
              id="student-studentNo"
              type="text"
              colorScheme="teal"
              onChange={(e) => handleInputChange(e, "studentNo")}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="student-department">Bölüm</FormLabel>
            <Select
              id="department-select"
              variant="filled"
              placeholder="Bölüm Seçiniz"
              onChange={(e) => handleInputChange(e, "departmentID")}
            >
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
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
            Kaydet
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

export default StudentForm;
