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
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Flex,
  Box,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";

function CourseForm({ isOpen, onClose, onCourseAdded, Toast }) {
  const [courseData, setCourseData] = useState({
    facultyID: "",
    code: "",
    name: "",
    description: "",
    courseDepartments: [
      {
        id: 0,
        departmentID: "",
        period: 1,
      },
    ],
  });
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
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

  const handleAddClick = () => {
    axios
      .post("http://localhost:3000/course", courseData)
      .then((response) => {
        console.log(response.data);
        onCourseAdded();
        Toast("Başarıyla Eklendi!", "success");
      })
      .catch((error) => {
        Toast(error.response.data.message, "error");
        console.error(error);
      });
  };

  const handleInputChange = (e, property) => {
    const value = e.target.value;
    setCourseData({
      ...courseData,
      [property]: value,
    });
  };

  const handleDepartmentChange = (e, index) => {
    const { name, value } = e.target;
    const updatedCourseDepartments = [...courseData.courseDepartments];
    updatedCourseDepartments[index] = {
      ...updatedCourseDepartments[index],
      [name]: value,
    };
    setCourseData({
      ...courseData,
      courseDepartments: updatedCourseDepartments,
    });
  };

  const handlePeriodChange = (value, index) => {
    const updatedCourseDepartments = [...courseData.courseDepartments];
    updatedCourseDepartments[index] = {
      ...updatedCourseDepartments[index],
      period: value,
    };
    setCourseData({
      ...courseData,
      courseDepartments: updatedCourseDepartments,
    });
  };

  const addDepartment = () => {
    const departments = courseData.courseDepartments;
    const maxId = departments.reduce(
      (max, department) => Math.max(max, department.id),
      0
    );
    departments.push({
      id: maxId + 1,
      departmentID: "",
      period: 1,
    });
    setCourseData({ ...courseData, courseDepartments: departments });
  };

  const deleteDepartment = (id) => {
    if (courseData.courseDepartments.length === 1) {
      Toast("Bir dersin en az bir bölüm olmalı!", "error");
      return;
    }
    const departments = courseData.courseDepartments;
    const newDepartments = departments.filter(
      (department) => department.id !== id
    );
    setCourseData({ ...courseData, courseDepartments: newDepartments });
  };

  useEffect(() => {
    fetchFaculties();
    fetchDepartments();
    console.log(courseData);
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Ders Ekle</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel htmlFor="faculty-name">Fakülte</FormLabel>
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
          <FormControl>
            <FormLabel htmlFor="course-code">Ders Kodu</FormLabel>
            <Input
              id="course-code"
              variant="filled"
              placeholder="Ders Kodu"
              onChange={(e) => handleInputChange(e, "code")}
            />
          </FormControl>
          <FormControl id="name" mb={4}>
            <FormLabel>Ad</FormLabel>
            <Input
              type="text"
              variant="filled"
              onChange={(e) => handleInputChange(e, "name")}
            />
          </FormControl>
          <FormControl id="description" mb={4}>
            <FormLabel>Açıklama</FormLabel>
            <Textarea
              type="text"
              variant="filled"
              onChange={(e) => handleInputChange(e, "description")}
            />
          </FormControl>

          {courseData.courseDepartments &&
            courseData.courseDepartments.map((courseDepartment, index) => (
              <Stack key={courseDepartment.id} mb={4}>
                <FormControl mb={4}>
                  <Flex>
                    <FormControl
                      id={`department-${index}`}
                      mb={4}
                      flex="2"
                      mr={4}
                    >
                      <FormLabel>
                        <Stack direction="row">
                          <>Bölüm {index + 1}</>
                          <button
                            onClick={addDepartment}
                            className="select-all-button"
                            type="button"
                          >
                            +
                          </button>
                          <button
                            onClick={() =>
                              deleteDepartment(courseDepartment.id)
                            }
                            className="select-all-button"
                            type="button"
                          >
                            -
                          </button>
                        </Stack>
                      </FormLabel>

                      <Select
                        name="departmentID"
                        placeholder="Bölüm Seçin"
                        value={courseDepartment.departmentID}
                        onChange={(e) => handleDepartmentChange(e, index)}
                      >
                        {departments.map((department) => (
                          <option key={department.id} value={department.id}>
                            {department.name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl id={`period-${index}`} mb={4} flex="1">
                      <FormLabel>Dönem</FormLabel>
                      <NumberInput
                        min={1}
                        max={8}
                        value={courseDepartment.period}
                        onChange={(value) => handlePeriodChange(value, index)}
                      >
                        <NumberInputField name="period" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </Flex>
                </FormControl>
              </Stack>
            ))}
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

export default CourseForm;
