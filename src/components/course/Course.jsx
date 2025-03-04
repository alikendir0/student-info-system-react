import CourseControls from "./CourseControls";
import CourseEdit from "./CourseEdit";

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

function Course() {
  const toast = useToast();
  const toastIdRef = React.useRef();

  const [courses, setCourses] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [checkedState, setCheckedState] = useState([]);
  const [checkedIDs, setCheckedIDs] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const {
    isOpen: isDescriptionModalOpen,
    onOpen: onDescriptionModalOpen,
    onClose: onDescriptionModalClose,
  } = useDisclosure();
  const [courseData, setCourseData] = useState([
    {
      id: "",
      code: "",
      facultyID: "",
      description: "",
      name: "",
      facultyName: "",
      courseDepartments: [],
    },
  ]);
  const [coursePeriod, setCoursePeriod] = useState();

  function Toast(e, status) {
    toastIdRef.current = toast({
      title: e,
      status: status,
      isClosable: true,
    });
  }

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    fetchCourseDepartment(course.id);
    onDescriptionModalOpen();
  };

  const fetchCourseDepartment = async (courseID) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/course/department/period/${courseID}`
      );
      const data = response.data.data;
      console.log(data);
      setCoursePeriod(data);
    } catch (error) {
      Toast("Bağlantı Hatası!", "error");
      console.error("Failed to fetch course department:", error);
    }
  };

  const fetchCourses = async () => {
    setIsLoaded(false);
    try {
      const response = await axios.get(`http://localhost:3000/courses`);
      const data = response.data.data;
      setCourses(data);
      setIsLoaded(true);
    } catch (error) {
      Toast("Bağlantı Hatası!", "error");
      console.error("Failed to fetch courses:", error);
      setTimeout(fetchCourses, 5000);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    setCheckedState(new Array(courses.length).fill(false));
  }, [courses]);

  const handleSelectAll = () => {
    const allChecked = checkedState.every(Boolean);
    const newState = new Array(courses.length).fill(!allChecked);
    setCheckedState(newState);

    const newCheckedIDs = !allChecked ? courses.map((course) => course.id) : [];
    setCheckedIDs(newCheckedIDs);
  };

  const handleCheck = (position, courseID) => {
    console.log(position, courseID);
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);

    const updatedCheckedIDs = [...checkedIDs];
    if (updatedCheckedState[position]) {
      updatedCheckedIDs.push(courseID);
    } else {
      const index = updatedCheckedIDs.indexOf(courseID);
      if (index > -1) {
        updatedCheckedIDs.splice(index, 1);
      }
    }
    setCheckedIDs(updatedCheckedIDs);
  };

  const deleteSelected = async () => {
    try {
      const deletePromises = checkedIDs.map((courseID) =>
        fetch(`http://localhost:3000/course/${courseID}`, {
          method: "DELETE",
        })
      );
      const responses = await Promise.all(deletePromises);

      responses.forEach((response) => {
        if (!response.ok) {
          console.error(
            `Failed to delete course with ID: ${response.url.split("/").pop()}`
          );
        }
      });
      fetchCourses();
      setCheckedIDs([]);
      Toast("Başarıyla Silindi!", "success");
    } catch (error) {
      Toast("Hata!", "error");
      console.error("Error deleting selected courses:", error);
    }
  };

  return (
    <>
      {isLoaded ? (
        <Flex direction="column" align="right" mt={8}>
          <Box position={"absolute"} alignSelf="flex-end" mr={6}>
            <CourseControls
              onCourseAdded={fetchCourses}
              onCourseDeleted={deleteSelected}
              Toast={Toast}
            />
          </Box>
          <Box position={"absolute"} alignSelf="flex-end" mr={6}>
            {isDescriptionModalOpen && (
              <Modal
                isOpen={isDescriptionModalOpen}
                onClose={onDescriptionModalClose}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Ders Açıklaması</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    {selectedCourse
                      ? selectedCourse.description
                      : "Açıklama Mevcut Değil."}
                    <Box mt={4} mb={2}>
                      Bölüm ve Dönem Bilgisi
                    </Box>
                    {coursePeriod &&
                      coursePeriod.map((period) => (
                        <Box key={period.id}>
                          <Box>
                            {period.departmentName} -
                            {Math.ceil(period.period / 2)}. Yıl{" "}
                            {period.period % 2 === 0 ? "Bahar" : "Güz"}{" "}
                            Döneminden itibaren
                          </Box>
                          <Box></Box>
                        </Box>
                      ))}
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      colorScheme="blue"
                      mr={3}
                      onClick={onDescriptionModalClose}
                    >
                      Tamam
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            )}
          </Box>
          <Box position={"absolute"} borderRadius={"md"}>
            <CourseEdit
              isOpen={isOpen}
              onClose={onClose}
              courseData={courseData}
              fetchCourses={fetchCourses}
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
              {courses.length !== 0 ? (
                <TableContainer>
                  <Table variant="striped" colorScheme="teal">
                    <TableCaption>Ders Listesi</TableCaption>
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
                        <Th textAlign={"center"}>Ders Kodu</Th>
                        <Th textAlign={"center"}>Ders Adı</Th>
                        <Th textAlign={"center"}>Fakülte</Th>
                        <Th textAlign={"center"}>Düzenle</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {courses.map((course, index) => (
                        <Tr key={course.id}>
                          <Td textAlign={"center"}>
                            <Checkbox
                              isChecked={checkedState[index]}
                              onChange={() => handleCheck(index, course.id)}
                            />
                          </Td>
                          <Td textAlign={"center"}>
                            <Button onClick={() => handleCourseClick(course)}>
                              {course.code}
                            </Button>
                          </Td>
                          <Td textAlign={"center"}>{course.name}</Td>
                          <Td textAlign={"center"}>{course.facultyName}</Td>
                          <Td textAlign={"center"}>
                            <Button
                              onClick={() => {
                                onOpen();
                                setCourseData({
                                  id: course.id,
                                  code: course.code,
                                  name: course.name,
                                  description: course.description,
                                  facultyID: course.facultyID,
                                  facultyName: course.facultyName,
                                  courseDepartments: course.courseDepartments,
                                });
                              }}
                            >
                              Düzenle
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              ) : (
                <Box textAlign="center" p={5}>
                  Hiçbir Ders Eklenmedi!
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

export default Course;
