import {
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

function StudentEdit({
  isOpen,
  onClose,
  studentData,
  fetchStudents,
  search,
  Toast,
}) {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
  };

  useEffect(() => {
    setStudent(studentData);
    fetchDepartments();
  }, [studentData]);

  useEffect(() => {
    console.log("Student data:", student);
  }, [student]);

  const updateStudent = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/student/${student.studentNo}`,
        student
      );
      if (response.status === 200) {
        onClose();
        fetchStudents(search);
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
              <FormControl id="period" mb={4}>
                <FormLabel htmlFor="student-period">Yıl</FormLabel>
                <Select
                  id="period-select"
                  variant="filled"
                  name="period"
                  value={student.period}
                  onChange={handleInputChange}
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
