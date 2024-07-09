import StudentControls from "./StudentControls";
import StudentEdit from "./StudentEdit";

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
  const [studentData, setStudentData] = useState([
    {
      id: "",
      firstName: "",
      lastName: "",
      studentNo: "",
    },
  ]);
  const [checkedState, setCheckedState] = useState([]);
  const [checkedIDs, setCheckedIDs] = useState([]);
  const [checkedSectionState, setCheckedSectionState] = useState([]);
  const [checkedSectionIDs, setCheckedSectionIDs] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isStudentEditOpen, setIsStudentEditOpen] = useState(false);
  const [sections, setSections] = useState([]);
  const [isSectionsModalOpen, setIsSectionsModalOpen] = useState(false);
  const [sectionsData, setSectionsData] = useState({
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

  const openStudentEdit = () => {
    setIsStudentEditOpen(true);
  };

  const closeStudentEdit = () => setIsStudentEditOpen(false);

  useEffect(() => {
    setCheckedState(new Array(students.length).fill(false));
  }, [students]);

  useEffect(() => {
    setCheckedSectionState(new Array(sections.length).fill(false));
  }, [sections]);

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

  const fetchSections = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/sections`);
      const data = response.data.data;
      setSections(data);
    } catch (error) {
      Toast("Bağlantı Hatası!", "error");
      console.error("Failed to fetch sections:", error);
    }
  };

  const handleOpenModal = async () => {
    if (checkedIDs.length == 1) {
      await fetchSections();
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

  const handleSectionCheck = (position, sectionID) => {
    const updatedCheckedState = checkedSectionState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedSectionState(updatedCheckedState);

    const updatedCheckedIDs = [...checkedSectionIDs];
    if (updatedCheckedState[position]) {
      updatedCheckedIDs.push(sectionID);
    } else {
      const index = updatedCheckedIDs.indexOf(sectionID);
      if (index > -1) {
        updatedCheckedIDs.splice(index, 1);
      }
    }
    setCheckedSectionIDs(updatedCheckedIDs);
  };

  const addSectionsToStudent = async (studentId, sectionIds) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/student/add/section/${studentId}`,
        {
          sections: sectionIds,
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
      console.error("Failed to add sections to student:", error);
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
    setCheckedSectionState(new Array(sections.length).fill(false));
    setCheckedSectionIDs([]);
    setCheckedIDs([]);
  };

  const deleteSelectedSections = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/students/delete/sections`,
        {
          data: { ids: checkedIDs },
        }
      );
      console.log(response.data);
      fetchSections();
      resetCheckboxes();
      Toast("Başarıyla Sıfırlandı!", "success");
    } catch (error) {
      Toast("Dersler Sıfırlanamadı!", "error");
      console.error("Error deleting selected sections:", error);
    }
  };

  const handleDerslerClick = async (studentID) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/student/sections/${studentID}`
      );
      const data = response.data;
      data.id = studentID;
      setSectionsData(data);
      setIsSectionsModalOpen(true);
    } catch (error) {
      Toast("Dersler Buunamadı!", "error");
      console.error("Failed to fetch students:", error);
    }
  };

  const deleteSelectedSection = async (studentID, sectionCode) => {
    console.log(studentID, sectionCode);
    try {
      const response = await axios.delete(
        `http://localhost:3000/student/delete/section/${studentID}/${sectionCode}`
      );
      Toast("Başarıyla Silindi!", "success");
      console.log(response.data);
      handleDerslerClick(studentID);
    } catch (error) {
      Toast("Ders Silinemedi!", "error");
      console.error("Failed to delete section:", error);
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
              onInspectSections={handleOpenModal}
              onResetSelected={deleteSelectedSections}
              Toast={Toast}
            />
          </Box>
          <Box position={"absolute"} borderRadius={"md"}>
            <StudentEdit
              isOpen={isStudentEditOpen}
              onClose={closeStudentEdit}
              studentData={studentData}
              fetchStudents={fetchStudents}
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
                isOpen={isSectionsModalOpen}
                onClose={() => setIsSectionsModalOpen(false)}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Ders Listesi</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    {sectionsData.data.length > 0 ? (
                      <TableContainer>
                        <Table variant="striped" colorScheme="teal">
                          <Thead>
                            <Tr>
                              <Th textAlign={"center"}>Ders Kodu</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {sectionsData.data.map((section, index) => (
                              <Tr key={index}>
                                <Td textAlign={"center"}>
                                  <CloseButton
                                    position={"absolute"}
                                    size="sm"
                                    className="section-delete-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteSelectedSection(
                                        sectionsData.id,
                                        section.sectionID
                                      );
                                    }}
                                  />
                                  {section.courseCode}
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
                          {sections.map((section, index) => (
                            <Tr key={section.id}>
                              <Td textAlign={"center"}>
                                <Checkbox
                                  isChecked={checkedSectionState[index]}
                                  onChange={() =>
                                    handleSectionCheck(index, section.id)
                                  }
                                />
                              </Td>
                              <Td textAlign={"center"}>{section.courseCode}</Td>
                              <Td textAlign={"center"}>{section.faculty}</Td>
                              <Td textAlign={"center"}>
                                {section.hour} {section.day}
                              </Td>
                              <Td textAlign={"center"}>{section.place}</Td>
                              <Td textAlign={"center"}>
                                {section.instructor.firstName}{" "}
                                {section.instructor.lastName}
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
                        addSectionsToStudent(checkedIDs[0], checkedSectionIDs)
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
                        <Th textAlign={"center"}>Bölüm</Th>
                        <Th textAlign={"center"}>Dersler</Th>
                        <Th textAlign={"center"}>Düzenle</Th>
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
                            {student.department.name}
                          </Td>
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
                          <Td textAlign={"center"}>
                            <Button
                              onClick={() => {
                                setStudentData({
                                  id: student.id,
                                  firstName: student.firstName,
                                  lastName: student.lastName,
                                  studentNo: student.studentNo,
                                  departmentName: student.department.name,
                                  departmentID: student.department.id,
                                });
                                openStudentEdit();
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
