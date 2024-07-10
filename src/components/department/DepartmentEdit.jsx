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

function DepartmentEdit({
  isOpen,
  onClose,
  departmentData,
  fetchDepartments,
  Toast,
}) {
  const [department, setDepartment] = useState({});
  const [faculties, setFaculties] = useState([]);

  useEffect(() => {
    console.log(departmentData);
    setDepartment(departmentData);
    fetchFaculties();
  }, [departmentData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value });
    console.log(department);
  };

  useEffect(() => {
    setDepartment(departmentData);
  }, [departmentData]);

  const updateDepartment = async () => {
    console.log(departmentData);
    try {
      const response = await axios.put(
        `http://localhost:3000/department/${department.id}`,
        department
      );
      if (response.status === 200) {
        onClose();
        fetchDepartments();
        Toast("Başarıyla Güncellendi!", "success");
      }
    } catch (error) {
      Toast("Hata!", "error");
      console.error("Error updating department:", error);
    }
  };

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
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ders Düzenle</ModalHeader>
          <ModalCloseButton />
          {department.id ? (
            <ModalBody>
              <FormControl id="id" mb={4}>
                <FormLabel>Fakülte ID</FormLabel>
                <Input
                  disabled={true}
                  type="text"
                  name="id"
                  value={department.id}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl id="name" mb={4}>
                <FormLabel>Fakülte Adı</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={department.name}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl id="abbreviation" mb={4}>
                <FormLabel>Kısaltma</FormLabel>
                <Input
                  type="text"
                  name="abbreviation"
                  value={department.abbreviation}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="department-faculty">Fakülte</FormLabel>
                <Select
                  id="faculty-select"
                  variant="filled"
                  name="facultyID"
                  value={department.facultyID}
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
            <Button colorScheme="blue" mr={3} onClick={updateDepartment}>
              Kaydet
            </Button>
            <Button onClick={onClose}>Kapat</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default DepartmentEdit;
