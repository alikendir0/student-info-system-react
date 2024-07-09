import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Select,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

function SectionEdit({ isOpen, onClose, sectionData, fetchSections, Toast }) {
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(
    sectionData.facultyID || ""
  );
  const [section, setSection] = useState(sectionData);

  useEffect(() => {
    fetchCourses(selectedFaculty);
    fetchInstructors(selectedFaculty);
  }, [selectedFaculty]);

  useEffect(() => {
    setSection(sectionData);
    fetchFaculties();
    if (selectedFaculty) {
      fetchCourses(selectedFaculty);
      fetchInstructors(selectedFaculty);
    }
  }, [isOpen]);

  const fetchFaculties = async () => {
    console.log(
      section.instructor.firstName + " " + section.instructor.lastName
    );
    try {
      const response = await axios.get(`http://localhost:3000/faculties`);
      setFaculties(response.data.data);
    } catch (error) {
      console.error("Failed to fetch faculties:", error);
    }
  };

  const fetchCourses = async (facultyID) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/courses/faculty/${facultyID}`
      );
      setCourses(response.data.data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const fetchInstructors = async (facultyID) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/instructors/faculty/${facultyID}`
      );
      setInstructors(response.data.data);
    } catch (error) {
      console.error("Failed to fetch instructors:", error);
    }
  };

  const handleFacultyChange = (e) => {
    const { name, value } = e.target;
    setSection({ ...section, [name]: value });
    setSelectedFaculty(e.target.value);
    console.log(section);
  };

  const handleInputChange = (e) => {
    console.log(section);
    const { name, value } = e.target;
    setSection({ ...section, [name]: value });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Section</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Faculty</FormLabel>
            <Select
              name="facultyID"
              value={section.facultyID}
              onChange={handleFacultyChange}
            >
              {faculties.map((faculty) => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Course</FormLabel>
            <Select
              onChange={handleInputChange}
              name="courseCode"
              value={section.course.code}
            >
              {courses.map((course) => (
                <option key={course.code}>{course.code}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Instructor</FormLabel>
            <Select
              name="instructorNo"
              onChange={handleInputChange}
              value={section.instructorNo}
            >
              {instructors.map((instructor) => (
                <option
                  key={instructor.instructorNo}
                  value={instructor.instructorNo}
                >
                  {instructor.firstName} {instructor.lastName}
                </option>
              ))}
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="ghost">Save Changes</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default SectionEdit;
