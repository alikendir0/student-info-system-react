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
  CloseButton,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import axios from "axios";

function Student() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [students, setStudents] = useState([]);
  const [checkedState, setCheckedState] = useState([]);
  const [checkedIDs, setCheckedIDs] = useState([]);
  const [checkedCourseState, setCheckedCourseState] = useState([]);
  const [checkedCourseIDs, setCheckedCourseIDs] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [courses, setCourses] = useState([]);
  const [isCoursesModalOpen, setIsCoursesModalOpen] = useState(false);
  const [coursesData, setCoursesData] = useState({
    id: "",
    data: [],
  });
  const toast = useToast();
  const toastIdRef = React.useRef();

  function Toast(e, status) {
    toastIdRef.current = toast({
      title: e,
      status: status,
      isClosable: true,
    });
  }

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
    setIsLoaded(false);
    try {
      const response = await axios.get(`http://localhost:3000/students`);
      const data = response.data.data;
      setStudents(data);
      setIsLoaded(true);
    } catch (error) {
      Toast("Bağlantı Hatası!", "error");
      console.error("Failed to fetch students:", error);
      setTimeout(fetchStudents, 5000);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/courses`);
      const data = response.data.data;
      setCourses(data);
    } catch (error) {
      Toast("Bağlantı Hatası!", "error");
      console.error("Failed to fetch courses:", error);
    }
  };

  const handleOpenModal = async () => {
    if (checkedIDs.length == 1) {
      await fetchCourses();
      onOpen();
    } else {
      Toast("Lütfen Yalnızca Bir Öğrenci Seçin!", "info");
    }
  };

  const handleSelectAll = () => {
    const allChecked = checkedState.every(Boolean);
    const newState = new Array(students.length).fill(!allChecked);
    setCheckedState(newState);

    const newCheckedIDs = !allChecked
      ? students.map((student) => student.studentNo)
      : [];
    setCheckedIDs(newCheckedIDs);
    console.log(newCheckedIDs);
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
      Toast("Başarıyla Atandı!", "success");
    } catch (error) {
      if (error.response.status === 409)
        Toast("Öğrenci Derslere Zaten Sahip", "info");
      else Toast("Dersler Atanamadı!", "error");
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
      Toast("Başarıyla Silindi!", "success");
    } catch (error) {
      Toast("Hata!", "error");
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
      Toast("Başarıyla Sıfırlandı!", "success");
    } catch (error) {
      Toast("Dersler Sıfırlanamadı!", "error");
      console.error("Error deleting selected courses:", error);
    }
  };

  const handleDerslerClick = async (studentID) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/student/courses/${studentID}`
      );
      const data = response.data;
      data.id = studentID;
      setCoursesData(data);
      setIsCoursesModalOpen(true);
    } catch (error) {
      Toast("Dersler Buunamadı!", "error");
      console.error("Failed to fetch students:", error);
    }
  };

  const deleteSelectedCourse = async (studentID, courseCode) => {
    console.log(studentID, courseCode);
    try {
      const response = await axios.delete(
        `http://localhost:3000/student/delete/course/${studentID}/${courseCode}`
      );
      Toast("Başarıyla Silindi!", "success");
      console.log(response.data);
      handleDerslerClick(studentID);
    } catch (error) {
      Toast("Ders Silinemedi!", "error");
      console.error("Failed to delete course:", error);
    }
  };

  return (
    <>
      {isLoaded ? (
        <Flex direction="column" mt={8} height="100vh">
          <Box position={"absolute"} alignSelf="flex-end" mr={6}>
            <StudentControls
              onStudentAdded={fetchStudents}
              onStudentDeleted={deleteSelected}
              onInspectCourses={handleOpenModal}
              onResetSelected={deleteSelectedCourses}
              Toast={Toast}
            />
          </Box>
          <Flex
            mt={6}
            justifyContent="center"
            alignItems="flex-start"
            height="100vh"
          >
            <Box mt={16}>
              <Modal
                isOpen={isCoursesModalOpen}
                onClose={() => setIsCoursesModalOpen(false)}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Ders Listesi</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    {coursesData.data.length > 0 ? (
                      <TableContainer>
                        <Table variant="striped" colorScheme="teal">
                          <Thead>
                            <Tr>
                              <Th textAlign={"center"}>Ders Kodu</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {coursesData.data.map((course, index) => (
                              <Tr key={index}>
                                <Td textAlign={"center"}>
                                  <CloseButton
                                    position={"absolute"}
                                    size="sm"
                                    className="course-delete-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteSelectedCourse(
                                        coursesData.id,
                                        course.courseID
                                      );
                                    }}
                                  />
                                  {course.courseCode}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Box textAlign="center" p={5}>
                        Hiçbir Ders Atanmadı!
                      </Box>
                    )}
                  </ModalBody>
                </ModalContent>
              </Modal>
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
                              <Td textAlign={"center"}>{course.courseCode}</Td>
                              <Td textAlign={"center"}>{course.faculty}</Td>
                              <Td textAlign={"center"}>
                                {course.hour} {course.day}
                              </Td>
                              <Td textAlign={"center"}>{course.place}</Td>
                              <Td textAlign={"center"}>
                                {course.instructor.firstName}{" "}
                                {course.instructor.lastName}
                              </Td>
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
              {students.length !== 0 ? (
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
                              onChange={() =>
                                handleCheck(index, student.studentNo)
                              }
                            />
                          </Td>
                          <Td textAlign={"center"}>{student.firstName}</Td>
                          <Td textAlign={"center"}>{student.lastName}</Td>
                          <Td textAlign={"center"}>{student.id}</Td>
                          <Td textAlign={"center"}>{student.studentNo}</Td>
                          <Td textAlign={"center"}>
                            <Button
                              className="dersler"
                              type="button"
                              onClick={() =>
                                handleDerslerClick(student.studentNo)
                              }
                            >
                              Dersler
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              ) : (
                <Box textAlign="center" p={5}>
                  Hiçbir Öğrenci Eklenmedi!
                </Box>
              )}
            </Box>
          </Flex>
        </Flex>
      ) : (
        <Spinner size="xl" mt={"100"} />
      )}
    </>
  );
}

export default Student;
