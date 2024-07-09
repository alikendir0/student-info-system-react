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

function CourseEdit({ isOpen, onClose, courseData, fetchCourses, Toast }) {
  const [course, setCourse] = useState({});
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
    setCourse(courseData);
  }, [courseData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
    console.log(course);
  };

  useEffect(() => {
    setCourse(courseData);
    fetchFaculties();
  }, [courseData]);

  const updateCourse = async () => {
    console.log(courseData);
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
              <FormControl id="faculty">
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
