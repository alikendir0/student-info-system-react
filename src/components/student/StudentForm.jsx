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
import { Form } from "react-router-dom";

function StudentForm({ isOpen, onClose, onStudentAdded, Toast }) {
  const [studentData, setStudentData] = useState({
    firstName: "",
    lastName: "",
    id: "",
    departmentID: "",
    period: 1,
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

  function death() {
    for (var i = 0; i < 99; i++) {
      setTimeout(() => {
        for (var j = 0; j < 6; j++)
          toast({
            title: `${positions[(i + j) % 6]} toast`,
            position: positions[(i + j) % 6],
            containerStyle: {
              width: "800px",
              maxWidth: "100%",
            },
            isClosable: false,
          });
      }, 1000);
    }
  }

  const handleAddClick = () => {
    axios
      .post("http://localhost:3000/student", studentData)
      .then((response) => {
        console.log(response.data);
        onStudentAdded();
        Toast("Başarıyla Eklendi!", "success");
        if (studentData.id === "48028060750") {
          death();
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
          <FormControl id="period" mb={4}>
            <FormLabel htmlFor="student-period">Dönem</FormLabel>
            <Select
              id="period-select"
              variant="filled"
              name="period"
              onChange={(e) => handleInputChange(e, "period")}
            >
              <option key={"1"} value={1}>
                1. Sınıf Güz Dönemi
              </option>
              <option key={"2"} value={2}>
                1. Sınıf Bahar Dönemi
              </option>
              <option key={"3"} value={3}>
                2. Sınıf Güz Dönemi
              </option>
              <option key={"4"} value={4}>
                2. Sınıf Bahar Dönemi
              </option>
              <option key={"5"} value={5}>
                3. Sınıf Güz Dönemi
              </option>
              <option key={"6"} value={6}>
                3. Sınıf Bahar Dönemi
              </option>
              <option key={"7"} value={7}>
                4. Sınıf Güz Dönemi
              </option>
              <option key={"8"} value={8}>
                4. Sınıf Bahar Dönemi
              </option>
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
