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

function StudentEdit({ isOpen, onClose, studentData, fetchStudents, Toast }) {
  const [student, setStudent] = useState({});
  const [departments, setDepartments] = useState([]);

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

  useEffect(() => {
    setStudent(studentData);
  }, [studentData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
  };

  useEffect(() => {
    setStudent(studentData);
    fetchDepartments();
  }, [studentData]);

  const updateStudent = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/student/${student.studentNo}`,
        student
      );
      if (response.status === 200) {
        onClose();
        fetchStudents();
        Toast("Başarıyla Güncellendi!", "success");
      }
    } catch (error) {
      Toast("Hata!", "error");
      console.error("Error updating student:", error);
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Öğrenci Düzenle</ModalHeader>
          <ModalCloseButton />
          {student.firstName ? (
            <ModalBody>
              <FormControl id="id" mb={4}>
                <FormLabel>Student ID</FormLabel>
                <Input
                  disabled={true}
                  type="text"
                  name="id"
                  value={student.id}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl id="firstName" mb={4}>
                <FormLabel>Ad</FormLabel>
                <Input
                  type="text"
                  name="firstName"
                  value={student.firstName}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl id="lastName" mb={4}>
                <FormLabel>Soyad</FormLabel>
                <Input
                  type="text"
                  name="lastName"
                  value={student.lastName}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl id="gender" mb={4}>
                <FormLabel htmlFor="student-gender">Cinsiyet</FormLabel>
                <Select
                  id="gender-select"
                  variant="filled"
                  name="gender"
                  value={student.gender}
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
              <FormControl id="studentNo" mb={4}>
                <FormLabel>Öğrenci Numarası</FormLabel>
                <Input
                  disabled={true}
                  type="text"
                  name="studentNo"
                  value={student.studentNo}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="student-department">Bölüm</FormLabel>
                <Select
                  id="department-select"
                  variant="filled"
                  name="departmentID"
                  value={student.departmentID}
                  onChange={handleInputChange}
                >
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </ModalBody>
          ) : (
            <Spinner />
          )}
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={updateStudent}>
              Kaydet
            </Button>
            <Button onClick={onClose}>Kapat</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default StudentEdit;
