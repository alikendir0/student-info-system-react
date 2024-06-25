import StudentControls from "./StudentControls";

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
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";

function Student() {
  const [students, setStudents] = useState([]);
  const [checkedState, setCheckedState] = useState([]);
  const [checkedIDs, setCheckedIDs] = useState([]);
  const [checkedCourseState, setCheckedCourseState] = useState([]);
  const [checkedCourseIDs, setCheckedCourseIDs] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    setCheckedState(new Array(students.length).fill(false));
  }, [students]);

  useEffect(() => {
    setCheckedCourseState(new Array(courses.length).fill(false));
  }, [courses]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/students`);
      const data = response.data.data;
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/courses`);
      const data = response.data.data;
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const handleOpenModal = async () => {
    await fetchCourses();
    onOpen();
  };

  const handleSelectAll = () => {
    const allChecked = checkedState.every(Boolean);
    const newState = new Array(students.length).fill(!allChecked);
    setCheckedState(newState);

    const newCheckedIDs = !allChecked
      ? students.map((student) => student.idNo)
      : [];
    setCheckedIDs(newCheckedIDs);
  };

  const handleCheck = (position, studentID) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);

    const updatedCheckedIDs = [...checkedIDs];
    if (updatedCheckedState[position]) {
      updatedCheckedIDs.push(studentID);
    } else {
      const index = updatedCheckedIDs.indexOf(studentID);
      if (index > -1) {
        updatedCheckedIDs.splice(index, 1);
      }
    }
    setCheckedIDs(updatedCheckedIDs);
  };

  const handleCourseCheck = (position, courseID) => {
    const updatedCheckedState = checkedCourseState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedCourseState(updatedCheckedState);

    const updatedCheckedIDs = [...checkedCourseIDs];
    if (updatedCheckedState[position]) {
      updatedCheckedIDs.push(courseID);
    } else {
      const index = updatedCheckedIDs.indexOf(courseID);
      if (index > -1) {
        updatedCheckedIDs.splice(index, 1);
      }
    }
    setCheckedCourseIDs(updatedCheckedIDs);
  };

  const addCoursesToStudent = async (studentId, courseIds) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/student/add/course/${studentId}`,
        {
          courses: courseIds,
        }
      );
      resetCheckboxes();
      onClose();
      console.log(response.data);
    } catch (error) {
      console.error("Failed to add courses to student:", error);
    }
  };

  const deleteSelected = async () => {
    try {
      const deletePromises = checkedIDs.map((studentID) =>
        fetch(`http://localhost:3000/student/${studentID}`, {
          method: "DELETE",
        })
      );
      const responses = await Promise.all(deletePromises);

      responses.forEach((response) => {
        if (!response.ok) {
          console.error(
            `Failed to delete student with ID: ${response.url.split("/").pop()}`
          );
        }
      });
      fetchStudents();
      setCheckedIDs([]);
    } catch (error) {
      console.error("Error deleting selected students:", error);
    }
  };

  const resetCheckboxes = () => {
    setCheckedState(new Array(students.length).fill(false));
    setCheckedCourseState(new Array(courses.length).fill(false));
    setCheckedCourseIDs([]);
    setCheckedIDs([]);
  };

  const deleteSelectedCourses = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/students/delete/courses`,
        {
          data: { ids: checkedIDs },
        }
      );
      console.log(response.data);
      fetchCourses();
      resetCheckboxes();
    } catch (error) {
      console.error("Error deleting selected courses:", error);
    }
  };

  const handleDerslerClick = async (studentID) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/student/courses/${studentID}`
      );
      const data = response.data.data;
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  return (
    <>
      <Flex direction="column" mt={8} height="100vh">
        <Box position={"absolute"} alignSelf="flex-end" mr={6}>
          <StudentControls
            onStudentAdded={fetchStudents}
            onStudentDeleted={deleteSelected}
            onInspectCourses={handleOpenModal}
            onResetSelected={deleteSelectedCourses}
          />
        </Box>
        <Flex
          mt={6}
          justifyContent="center"
          alignItems="flex-start"
          height="100vh"
        >
          <Box mt={16}>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Ders Listesi</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <TableContainer>
                    <Table variant="striped" colorScheme="teal">
                      <Thead>
                        <Tr>
                          <Th textAlign={"center"}></Th>
                          <Th textAlign={"center"}>Ders Kodu</Th>
                          <Th textAlign={"center"}>Fakülte</Th>
                          <Th textAlign={"center"}>Zaman</Th>
                          <Th textAlign={"center"}>Sınıf</Th>
                          <Th textAlign={"center"}>Öğretim Görevlisi</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {courses.map((course, index) => (
                          <Tr key={course.id}>
                            <Td textAlign={"center"}>
                              <Checkbox
                                isChecked={checkedCourseState[index]}
                                onChange={() =>
                                  handleCourseCheck(index, course.id)
                                }
                              />
                            </Td>
                            <Td textAlign={"center"}>{course.code}</Td>
                            <Td textAlign={"center"}>{course.faculty}</Td>
                            <Td textAlign={"center"}>{course.time}</Td>
                            <Td textAlign={"center"}>{course.place}</Td>
                            <Td textAlign={"center"}>{course.instructor}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={() =>
                      addCoursesToStudent(checkedIDs[0], checkedCourseIDs)
                    }
                  >
                    Ekle
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <TableContainer>
              <Table variant="striped" colorScheme="teal">
                <TableCaption> Öğrenci Listesi</TableCaption>
                <Thead>
                  <Tr>
                    <Th textAlign={"center"}>
                      <button
                        onClick={handleSelectAll}
                        className="select-all-button"
                        type="button"
                      >
                        Hepsini Seç
                      </button>
                    </Th>
                    <Th textAlign={"center"}>Ad</Th>
                    <Th textAlign={"center"}>Soyad</Th>
                    <Th textAlign={"center"}>T.C. Kimlik Numarası</Th>
                    <Th textAlign={"center"}>Öğrenci Numarası</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {students.map((student, index) => (
                    <Tr key={student.id}>
                      <Td textAlign={"center"}>
                        <Checkbox
                          isChecked={checkedState[index]}
                          onChange={() => handleCheck(index, student.id)}
                        />
                      </Td>
                      <Td textAlign={"center"}>{student.name}</Td>
                      <Td textAlign={"center"}>{student.lastName}</Td>
                      <Td textAlign={"center"}>{student.idNo}</Td>
                      <Td textAlign={"center"}>{student.studentNo}</Td>
                      <Td textAlign={"center"}>
                        <button
                          className="dersler"
                          type="button"
                          onClick={() => handleDerslerClick(student.id)}
                        >
                          Dersler
                        </button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Flex>
      </Flex>
    </>
  );
}

export default Student;
