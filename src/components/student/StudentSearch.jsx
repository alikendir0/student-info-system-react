import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  useToast,
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import { Form } from "react-router-dom";
import axios from "axios";

function StudentSearch({ isOpen, onClose, fetchStudents, search, Toast }) {
  const [searchParameters, setSearchParameters] = useState({});
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
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchDepartments();
    search.split("&").map((param) => {
      if (param === "") return;
      const x = param.split("=");
      setSearchParameters({
        ...searchParameters,
        [x[0]]: x[1],
      });
    });
  }, [search]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParameters({
      ...searchParameters,
      [name]: value,
    });
  };

  const handleSearch = () => {
    console.log("Searching students with parameters:", searchParameters);
    var params = "";
    for (let key in searchParameters) {
      if (searchParameters[key] !== "") {
        params += `${key}=${searchParameters[key]}&`;
      }
    }
    if (params.length > 0) {
      Toast("Öğrenci aranıyor...", "info");
      fetchStudents(params);
      onClose();
    } else {
      Toast("En az bir bilgi giriniz", "error");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Öğrenci Ara</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel htmlFor="student-firstName">Ad</FormLabel>
            <Input
              name="firstName"
              placeholder="Ad"
              type="text"
              onChange={handleInputChange}
              value={searchParameters.firstName || ""}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="student-lastName">Öğrenci Soyadı</FormLabel>
            <Input
              name="lastName"
              placeholder="Soyad"
              type="text"
              colorScheme="teal"
              onChange={handleInputChange}
              value={searchParameters.lastName || ""}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="student-gender">Cinsiyet</FormLabel>
            <Select
              name="gender"
              placeholder="Cinsiyet Seçiniz"
              type="text"
              colorScheme="teal"
              onChange={handleInputChange}
              value={searchParameters.gender || "Cinsiyet Seçiniz"}
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
          <FormControl mb={4}>
            <FormLabel htmlFor="student-id">T.C. Kimlik Numarası</FormLabel>
            <Input
              name="id"
              placeholder="T.C. Kimlik Numarası"
              type="text"
              colorScheme="teal"
              onChange={handleInputChange}
              value={searchParameters.id || ""}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="student-no">Öğrenci Numarası</FormLabel>
            <Input
              name="studentNo"
              placeholder="Öğrenci Numarası"
              type="text"
              colorScheme="teal"
              onChange={handleInputChange}
              value={searchParameters.studentNo || ""}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="student-department">Bölüm</FormLabel>
            <Select
              name="departmentID"
              variant="filled"
              placeholder="Bölüm Seçiniz"
              onChange={handleInputChange}
              value={searchParameters.departmentID || ""}
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
          <Button colorScheme="blue" mr={3} onClick={handleSearch}>
            Ara
          </Button>
          <Button variant="ghost" onClick={onClose}>
            İptal
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default StudentSearch;
