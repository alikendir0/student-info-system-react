import CourseControls from "./CourseControls";

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

  function Toast(e, status) {
    toastIdRef.current = toast({
      title: e,
      status: status,
      isClosable: true,
    });
  }

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
          <Box position={"absolute"} alignSelf="flex-end" mr={6}></Box>
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
                        <Th textAlign={"center"}>Fakülte</Th>
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
                          <Td textAlign={"center"}>{course.code}</Td>
                          <Td textAlign={"center"}>{course.facultyName}</Td>
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
