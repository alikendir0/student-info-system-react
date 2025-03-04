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
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stack,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import axios from "axios";

function CourseEdit({ isOpen, onClose, courseData, fetchCourses, Toast }) {
  const [course, setCourse] = useState({
    id: "",
    code: "",
    facultyID: "",
    description: "",
    name: "",
    facultyName: "",
    courseDepartments: [],
  });
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);

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
    setCourse(courseData);
    fetchFaculties();
    fetchDepartments();
  }, [courseData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  const handleDepartmentChange = (e, index) => {
    const { name, value } = e.target;
    const updatedCourseDepartments = [...course.courseDepartments];
    updatedCourseDepartments[index] = {
      ...updatedCourseDepartments[index],
      [name]: value,
    };
    setCourse({ ...course, courseDepartments: updatedCourseDepartments });
  };

  const handlePeriodChange = (value, index) => {
    const updatedCourseDepartments = [...course.courseDepartments];
    updatedCourseDepartments[index] = {
      ...updatedCourseDepartments[index],
      period: value,
    };
    setCourse({ ...course, courseDepartments: updatedCourseDepartments });
  };

  const addDepartment = () => {
    const departments = course.courseDepartments;
    const maxId = departments.reduce(
      (max, department) => Math.max(max, department.id),
      0
    );
    departments.push({
      id: maxId + 1,
      departmentID: "",
      period: 1,
    });
    setCourse({ ...course, courseDepartments: departments });
  };

  const deleteDepartment = (id) => {
    if (course.courseDepartments.length === 1) {
      Toast("Bir dersin en az bir bölüm olmalı!", "error");
      return;
    }
    const departments = course.courseDepartments;
    const newDepartments = departments.filter(
      (department) => department.id !== id
    );
    setCourse({ ...course, courseDepartments: newDepartments });
  };

  const updateCourse = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/course/${course.id}`,
        course
      );
      if (response.status === 200) {
        onClose();
        fetchCourses();
        Toast("Başarıyla Güncellendi!", "success");
      }
    } catch (error) {
      Toast("Hata!", "error");
      console.error("Error updating course:", error);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ders Düzenle</ModalHeader>
          <ModalCloseButton />
          {course.code ? (
            <ModalBody>
              <FormControl id="id" mb={4}>
                <FormLabel>Course ID</FormLabel>
                <Input
                  disabled={true}
                  type="text"
                  name="id"
                  value={course.id}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl id="code" mb={4}>
                <FormLabel>Kod</FormLabel>
                <Input
                  type="text"
                  name="code"
                  value={course.code}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl id="name" mb={4}>
                <FormLabel>Ad</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={course.name}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl id="description" mb={4}>
                <FormLabel>Açıklama</FormLabel>
                <Textarea
                  type="text"
                  name="description"
                  value={course.description}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl id="faculty" mb={4}>
                <FormLabel htmlFor="course-faculty">Fakülte</FormLabel>
                <Select
                  id="faculty-select"
                  variant="filled"
                  name="facultyID"
                  value={course.facultyID}
                  onChange={handleInputChange}
                >
                  {faculties.map((faculty) => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {course.courseDepartments.length === 0 ? (
                <Button onClick={addDepartment}>Bölüm Ekle</Button>
              ) : (
                course.courseDepartments.map((courseDepartment, index) => (
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
                            onChange={(value) =>
                              handlePeriodChange(value, index)
                            }
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
                ))
              )}
            </ModalBody>
          ) : (
            <Spinner />
          )}
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={updateCourse}>
              Kaydet
            </Button>
            <Button onClick={onClose}>Kapat</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CourseEdit;
