import InstructorControls from "./InstructorControls";
import InstructorEdit from "./InstructorEdit";

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
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form } from "react-router-dom";

function Instructor() {
  const toast = useToast();
  const toastIdRef = React.useRef();

  const [instructors, setInstructors] = useState([]);
  const [instructorData, setInstructorData] = useState([
    {
      id: "",
      firstName: "",
      lastName: "",
      instructorNo: "",
      facultyName: "",
      facultyID: "",
    },
  ]);
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

  const fetchInstructors = async () => {
    setIsLoaded(false);
    try {
      const response = await axios.get(`http://localhost:3000/instructors`);
      const data = response.data.data;
      setInstructors(data);
      setIsLoaded(true);
    } catch (error) {
      Toast("Bağlantı Hatası!", "error");
      console.error("Failed to fetch instructors:", error);
      setTimeout(fetchInstructors, 5000);
    }
  };

  const deleteSelected = async () => {
    try {
      const deletePromises = checkedIDs.map((instructorID) =>
        fetch(`http://localhost:3000/instructor/${instructorID}`, {
          method: "DELETE",
        })
      );
      const responses = await Promise.all(deletePromises);

      responses.forEach((response) => {
        if (!response.ok) {
          console.error(
            `Failed to delete instructor with ID: ${response.url
              .split("/")
              .pop()}`
          );
        }
      });
      fetchInstructors();
      setCheckedIDs([]);
      Toast("Başarıyla Silindi!", "success");
    } catch (error) {
      Toast("Hata!", "error");
      console.error("Error deleting selected instructors:", error);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  useEffect(() => {
    setCheckedState(new Array(instructors.length).fill(false));
  }, [instructors]);

  const handleSelectAll = () => {
    const allChecked = checkedState.every(Boolean);
    const newState = new Array(instructors.length).fill(!allChecked);
    setCheckedState(newState);

    const newCheckedIDs = !allChecked
      ? instructors.map((instructor) => instructor.instructorID)
      : [];
    setCheckedIDs(newCheckedIDs);
  };

  const handleCheck = (position, instructorID) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);

    const updatedCheckedIDs = [...checkedIDs];
    if (updatedCheckedState[position]) {
      updatedCheckedIDs.push(instructorID);
    } else {
      const index = updatedCheckedIDs.indexOf(instructorID);
      if (index > -1) {
        updatedCheckedIDs.splice(index, 1);
      }
    }
    setCheckedIDs(updatedCheckedIDs);
  };

  return (
    <>
      {isLoaded ? (
        <Flex direction="column" align="right" mt={8}>
          <Box position={"absolute"} alignSelf="flex-end" mr={6}>
            <InstructorControls
              onInstructorAdded={fetchInstructors}
              onInstructorDeleted={deleteSelected}
              Toast={Toast}
            />
          </Box>
          <Box position={"absolute"} borderRadius={"md"}>
            <InstructorEdit
              isOpen={isOpen}
              onClose={onClose}
              instructorData={instructorData}
              fetchInstructors={fetchInstructors}
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
              {instructors.length !== 0 ? (
                <TableContainer>
                  <Table variant="striped" colorScheme="teal">
                    <TableCaption>Öğretim Üyeleri</TableCaption>
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
                        <Th textAlign={"center"}>Öğretim Numarası</Th>
                        <Th textAlign={"center"}>Fakülte</Th>
                        <Th textAlign={"center"}>Düzenle</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {instructors.map((instructor, index) => (
                        <Tr key={instructor.id}>
                          <Td textAlign={"center"}>
                            <Checkbox
                              isChecked={checkedState[index]}
                              onChange={() =>
                                handleCheck(index, instructor.instructorNo)
                              }
                            />
                          </Td>
                          <Td textAlign={"center"}>{instructor.firstName}</Td>
                          <Td textAlign={"center"}>{instructor.lastName}</Td>
                          <Td textAlign={"center"}>{instructor.id}</Td>
                          <Td textAlign={"center"}>
                            {instructor.instructorNo || "-"}
                          </Td>
                          <Td textAlign={"center"}>{instructor.facultyName}</Td>
                          <Td textAlign={"center"}>
                            <Button
                              onClick={() => {
                                onOpen();
                                setInstructorData({
                                  id: instructor.id,
                                  firstName: instructor.firstName,
                                  lastName: instructor.lastName,
                                  instructorNo: instructor.instructorNo,
                                  facultyName: instructor.facultyName,
                                  facultyID: instructor.facultyID,
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
                  Hiçbir Öğretim Üyesi Eklenmedi!
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

export default Instructor;
