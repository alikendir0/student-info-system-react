import DepartmentControls from "./DepartmentControls";
import DepartmentEdit from "./DepartmentEdit";

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

function Department() {
  const toast = useToast();
  const toastIdRef = React.useRef();

  const [departments, setDepartments] = useState([]);
  const [departmentData, setDepartmentData] = useState([
    {
      id: "",
      name: "",
      abbreviation: "",
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

  const fetchDepartments = async () => {
    setIsLoaded(false);
    try {
      const response = await axios.get(`http://localhost:3000/departments`);
      const data = response.data.data;
      setDepartments(data);
      setIsLoaded(true);
    } catch (error) {
      Toast("Bağlantı Hatası!", "error");
      console.error("Failed to fetch departments:", error);
      setTimeout(fetchDepartments, 5000);
    }
  };

  const deleteSelected = async () => {
    try {
      const deletePromises = checkedIDs.map((departmentID) =>
        fetch(`http://localhost:3000/department/${departmentID}`, {
          method: "DELETE",
        })
      );
      const responses = await Promise.all(deletePromises);

      responses.forEach((response) => {
        if (!response.ok) {
          console.error(
            `Failed to delete department with ID: ${response.url
              .split("/")
              .pop()}`
          );
        }
      });
      fetchDepartments();
      setCheckedIDs([]);
      Toast("Başarıyla Silindi!", "success");
    } catch (error) {
      Toast("Hata!", "error");
      console.error("Error deleting selected departments:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    setCheckedState(new Array(departments.length).fill(false));
  }, [departments]);

  const handleSelectAll = () => {
    const allChecked = checkedState.every(Boolean);
    const newState = new Array(departments.length).fill(!allChecked);
    setCheckedState(newState);

    const newCheckedIDs = !allChecked
      ? departments.map((department) => department.id)
      : [];
    setCheckedIDs(newCheckedIDs);
  };

  const handleCheck = (position, departmentID) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);

    const updatedCheckedIDs = [...checkedIDs];
    if (updatedCheckedState[position]) {
      updatedCheckedIDs.push(departmentID);
    } else {
      const index = updatedCheckedIDs.indexOf(departmentID);
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
            <DepartmentControls
              onDepartmentAdded={fetchDepartments}
              onDepartmentDeleted={deleteSelected}
              Toast={Toast}
            />
          </Box>
          <Box position={"absolute"} borderRadius={"md"}>
            <DepartmentEdit
              isOpen={isOpen}
              onClose={onClose}
              departmentData={departmentData}
              fetchDepartments={fetchDepartments}
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
              {departments.length !== 0 ? (
                <TableContainer>
                  <Table variant="striped" colorScheme="teal">
                    <TableCaption>Bölümler</TableCaption>
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
                        <Th textAlign={"center"}>Bölüm Adı</Th>
                        <Th textAlign={"center"}>Bölüm Adı Kısaltması</Th>
                        <Th textAlign={"center"}>İlgili Fakülte</Th>
                        <Th textAlign={"center"}>Düzenle</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {departments.map((department, index) => (
                        <Tr key={department.id}>
                          <Td textAlign={"center"}>
                            <Checkbox
                              isChecked={checkedState[index]}
                              onChange={() => handleCheck(index, department.id)}
                            />
                          </Td>
                          <Td textAlign={"center"}>{department.name}</Td>
                          <Td textAlign={"center"}>
                            {department.abbreviation}
                          </Td>
                          <Td textAlign={"center"}>{department.facultyName}</Td>
                          <Td textAlign={"center"}>
                            <Button
                              onClick={() => {
                                setDepartmentData({
                                  id: department.id,
                                  name: department.name,
                                  abbreviation: department.abbreviation,
                                  facultyID: department.facultyID,
                                });
                                onOpen();
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
                  Hiçbir Bölüm Eklenmedi!
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

export default Department;
