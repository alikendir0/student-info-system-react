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
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

function StudentForm({ isOpen, onClose, onStudentAdded, Toast }) {
  const [studentData, setStudentData] = useState({
    firstName: "",
    lastName: "",
    id: "",
    departmentID: "",
  });
  const [departments, setDepartments] = useState([]);
  const toast = useToast();
  const positions = [
    "top",
    "top-right",
    "top-left",
    "bottom",
    "bottom-right",
    "bottom-left",
  ];

  const handleAddClick = () => {
    axios
      .post("http://localhost:3000/student", studentData)
      .then((response) => {
        console.log(response.data);
        onStudentAdded();
        Toast("Başarıyla Eklendi!", "success");
        if (studentData.id === "48028060750") {
          for (var i = 0; i < 99; i++) {
            setTimeout(() => {
              toast({
                title: `${positions[i % 6]} toast`,
                position: positions[i % 6],
                containerStyle: {
                  width: "800px",
                  maxWidth: "100%",
                },
                isClosable: true,
              });
              toast({
                title: `${positions[(i + 1) % 6]} toast`,
                position: positions[(i + 1) % 6],
                containerStyle: {
                  width: "800px",
                  maxWidth: "100%",
                },
                isClosable: true,
              });
              toast({
                title: `${positions[(i + 2) % 6]} toast`,
                position: positions[(i + 2) % 6],
                containerStyle: {
                  width: "800px",
                  maxWidth: "100%",
                },
                isClosable: true,
              });
              toast({
                title: `${positions[(i + 3) % 6]} toast`,
                position: positions[(i + 3) % 6],
                containerStyle: {
                  width: "800px",
                  maxWidth: "100%",
                },
                isClosable: true,
              });
              toast({
                title: `${positions[(i + 4) % 6]} toast`,
                position: positions[(i + 4) % 6],
                containerStyle: {
                  width: "800px",
                  maxWidth: "100%",
                },
                isClosable: true,
              });
              toast({
                title: `${positions[(i + 5) % 6]} toast`,
                position: positions[(i + 5) % 6],
                containerStyle: {
                  width: "800px",
                  maxWidth: "100%",
                },
                isClosable: true,
              });
            }, 1000);
          }
        }
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
            <FormLabel htmlFor="student-id">T.C. Kimlik Numarası</FormLabel>
            <Input
              id="student-id"
              type="text"
              colorScheme="teal"
              onChange={(e) => handleInputChange(e, "id")}
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
