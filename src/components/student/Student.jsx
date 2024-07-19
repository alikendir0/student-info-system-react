import StudentControls from "./StudentControls";
import StudentEdit from "./StudentEdit";
import StudentSearch from "./StudentSearch";

import {
  Flex,
  Box,
  Table,
  Text,
  TableCaption,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tfoot,
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
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";

function Student() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentData, setStudentData] = useState([
    {
      id: "",
      firstName: "",
      lastName: "",
      departmentName: "",
      departmentID: "",
      gender: "",
    },
  ]);
  const [checkedState, setCheckedState] = useState([]);
  const [checkedIDs, setCheckedIDs] = useState([]);
  const [checkedSectionState, setCheckedSectionState] = useState([]);
  const [checkedSectionIDs, setCheckedSectionIDs] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isStudentEditOpen, setIsStudentEditOpen] = useState(false);
  const [sections, setSections] = useState([]);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);
  const [isSectionsModalOpen, setIsSectionsModalOpen] = useState(false);
  const [sectionsData, setSectionsData] = useState({
    id: "",
    data: [],
  });
  const toast = useToast();
  const toastIdRef = React.useRef();
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("");
  const {
    isOpen: isSearchOpen,
    onOpen: onSearchOpen,
    onClose: onSeachClose,
  } = useDisclosure();
  const [resetButton, setResetButton] = useState(false);
  const [searchParameters, setSearchParameters] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [maxPage, setMaxPage] = useState(1);
  const [noData, setNoData] = useState(0);
  const [search, setSearch] = useState("");

  const handleNext = () => {
    if (page < maxPage) setPage(page + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  function Toast(e, status) {
    toastIdRef.current = toast({
      title: e,
      status: status,
      isClosable: true,
    });
  }

  const sortByKey = async (key) => {
    if (sortBy !== key) {
      setOrder("asc");
      setSortBy(key);
    } else {
      setSortBy(key);
      if (order === "") setOrder("asc");
      else if (order === "asc") setOrder("desc");
      else setOrder("asc");
    }
  };

  useEffect(() => {
    fetchStudents(search);
  }, [order, sortBy, page, pageSize]);

  const openStudentEdit = () => {
    setIsStudentEditOpen(true);
  };

  const closeStudentEdit = () => setIsStudentEditOpen(false);

  const openDeleteConfirmModal = () => {
    if (checkedIDs.length === 0) {
      Toast("Lütfen Öğrenci Seçin!", "info");
      return;
    }
    setIsDeleteConfirmModalOpen(true);
  };
  const closeDeleteConfirmModal = () => setIsDeleteConfirmModalOpen(false);

  useEffect(() => {
    setCheckedState(new Array(students.length).fill(false));
  }, [students]);

  useEffect(() => {
    setCheckedSectionState(new Array(sections.length).fill(false));
  }, [sections]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const fetchStudents = async (credentials) => {
    if (credentials && credentials !== "") {
      var params = "";
      credentials.split("&").forEach((param) => {
        if (param === "") return;
        const x = param.split("=");
        params += `${x[0]}=${x[1]} `;
        setSearchParameters(params);
      });
      setResetButton(true);
      setSearch(credentials);
    } else {
      setResetButton(false);
      setSearch("");
    }
    setIsLoaded(false);
    try {
      const response = await axios.get(
        `http://localhost:3000/students?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&order=${order}&${credentials}`
      );
      const data = response.data.data.students;
      setMaxPage(response.data.data.maxPage);
      setNoData(response.data.data.count);
      setStudents(data);
      setIsLoaded(true);
      setCheckedIDs([]);
    } catch (error) {
      Toast("Bağlantı Hatası!", "error");
      console.error("Failed to fetch students:", error);
      setTimeout(fetchStudents(credentials), 5000);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/sections/student/${checkedIDs[0]}`
      );
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

      var successful = [];
      var failed = [];
      var error = [];
      responses.forEach((response) => {
        if (response.status === 200) {
          successful.push(response.url.split("/").pop());
        } else if (response.status === 409) {
          failed.push(response.url.split("/").pop());
        } else {
          error.push(response.url.split("/").pop());
        }
      });

      if (error.length > 0) {
        Toast(`Hata: ${error}`, "error");
      }

      if (failed.length > 0) {
        Toast(`Öğrenci(ler) Derse Sahip: ${failed}`, "warning");
      }

      if (successful.length > 0) {
        Toast(`Başarıyla Silindi: ${successful}`, "success");
      }

      fetchStudents(search);
      closeDeleteConfirmModal();
      setCheckedIDs([]);
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

  function getGenderDisplay(genderCode) {
    const genderMap = {
      M: "Erkek",
      F: "Kadın",
      O: "Diğer",
    };
    return genderMap[genderCode] || "Bilinmiyor";
  }

  return (
    <>
      {isLoaded ? (
        <Flex direction="column" mt={8} height="100vh">
          <Button
            colorScheme="blue"
            onClick={onSearchOpen}
            mb={4}
            position={"absolute"}
          >
            Öğrenci Ara
          </Button>
          {resetButton && (
            <>
              <Button
                colorScheme="blue"
                onClick={() => fetchStudents()}
                mb={4}
                position={"absolute"}
                ml={130}
              >
                Sıfırla
              </Button>
              <Box>
                <Text>
                  <span style={{ color: "green" }}>{searchParameters}</span>{" "}
                  için sonuçlar gösteriliyor,{" "}
                  <span style={{ color: "red" }}>{noData}</span> sonuç bulundu.
                </Text>
              </Box>
            </>
          )}
          <Box position={"absolute"} alignSelf="flex-end" mr={6}>
            <StudentControls
              onStudentAdded={fetchStudents}
              onStudentDeleted={openDeleteConfirmModal}
              onInspectSections={handleOpenModal}
              onResetSelected={deleteSelectedSections}
              Toast={Toast}
            />
          </Box>
          <Box position={"absolute"} borderRadius={"md"}>
            <Modal
              isOpen={isDeleteConfirmModalOpen}
              onClose={closeDeleteConfirmModal}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Silme Onayı</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  Seçili öğrencileri silmek istediğinizden emin misiniz?
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="red" mr={3} onClick={deleteSelected}>
                    Delete
                  </Button>
                  <Button variant="ghost" onClick={closeDeleteConfirmModal}>
                    Cancel
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
          <Box position={"absolute"} borderRadius={"md"}>
            <StudentSearch
              isOpen={isSearchOpen}
              onClose={onSeachClose}
              fetchStudents={fetchStudents}
              search={search}
              Toast={Toast}
            />
          </Box>
          <Box position={"absolute"} borderRadius={"md"}>
            <StudentEdit
              isOpen={isStudentEditOpen}
              onClose={closeStudentEdit}
              studentData={studentData}
              fetchStudents={fetchStudents}
              search={search}
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
                              <Td textAlign={"center"}>
                                {section.course.code}
                              </Td>
                              <Td textAlign={"center"}>
                                {section.course["faculty"].name}
                              </Td>
                              <Td textAlign={"center"}>
                                {section["section-sessions"].map((session) => (
                                  <div key={session.id}>
                                    {session.hour} {session.day}
                                  </div>
                                ))}
                              </Td>
                              <Td textAlign={"center"}>
                                {section["section-sessions"].map((session) => (
                                  <div key={session.id}>{session.roomNo}</div>
                                ))}
                              </Td>
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
                <>
                  <TableContainer>
                    <Table variant="striped" colorScheme="teal">
                      <TableCaption> Öğrenci Listesi</TableCaption>
                      <Thead>
                        <Tr>
                          <Th textAlign={"center"} width={"5%"}>
                            <button
                              onClick={handleSelectAll}
                              className="select-all-button"
                              type="button"
                            >
                              Hepsini Seç
                            </button>
                          </Th>
                          <Th textAlign={"center"} width={"15%"}>
                            <button
                              onClick={() => sortByKey("firstName")}
                              className="sortby-name-button"
                              type="button"
                            >
                              Ad
                              {sortBy === "firstName" &&
                                (order === "asc" ? (
                                  <ChevronDownIcon />
                                ) : (
                                  <ChevronUpIcon />
                                ))}
                            </button>
                          </Th>
                          <Th textAlign={"center"} width={"15%"}>
                            <button
                              onClick={() => sortByKey("lastName")}
                              className="sortby-lastName-button"
                              type="button"
                            >
                              Soyad
                              {sortBy === "lastName" &&
                                (order === "asc" ? (
                                  <ChevronDownIcon />
                                ) : (
                                  <ChevronUpIcon />
                                ))}
                            </button>
                          </Th>
                          <Th textAlign={"center"} width={"15%"}>
                            <button
                              onClick={() => sortByKey("id")}
                              className="sortby-id-button"
                              type="button"
                            >
                              T.C. Kimlik Numarası
                              {sortBy === "id" &&
                                (order === "asc" ? (
                                  <ChevronDownIcon />
                                ) : (
                                  <ChevronUpIcon />
                                ))}
                            </button>
                          </Th>
                          <Th textAlign={"center"} width={"5%"}>
                            Cinsiyet
                          </Th>
                          <Th textAlign={"center"} width={"10%"}>
                            <button
                              onClick={() => sortByKey("studentNo")}
                              className="sortby-studentNo-button"
                              type="button"
                            >
                              Öğrenci Numarası
                              {sortBy === "studentNo" &&
                                (order === "asc" ? (
                                  <ChevronDownIcon />
                                ) : (
                                  <ChevronUpIcon />
                                ))}
                            </button>
                          </Th>
                          <Th textAlign={"center"} width={"10%"}>
                            <button
                              onClick={() => sortByKey("departmentID")}
                              className="sortby-department-button"
                              type="button"
                            >
                              Bölüm
                              {sortBy === "departmentID" &&
                                (order === "asc" ? (
                                  <ChevronDownIcon />
                                ) : (
                                  <ChevronUpIcon />
                                ))}
                            </button>
                          </Th>
                          <Th textAlign={"center"} width={"10%"}>
                            <button
                              onClick={() => sortByKey("period")}
                              className="sortby-period-button"
                              type="button"
                            >
                              Dönem
                              {sortBy === "period" &&
                                (order === "asc" ? (
                                  <ChevronDownIcon />
                                ) : (
                                  <ChevronUpIcon />
                                ))}
                            </button>
                          </Th>
                          <Th textAlign={"center"} width={"10%"}>
                            Dersler
                          </Th>
                          <Th textAlign={"center"} width={"10%"}>
                            Düzenle
                          </Th>
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
                            <Td textAlign={"center"}>
                              {getGenderDisplay(student.gender)}
                            </Td>
                            <Td textAlign={"center"}>{student.studentNo}</Td>
                            <Td textAlign={"center"}>
                              {student.department.name}
                            </Td>
                            <Td textAlign={"center"}>
                              {Math.ceil(student.period / 2)}. Yıl{" "}
                              {student.period % 2 === 0 ? "Bahar" : "Güz"}{" "}
                              Dönemi
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
                                    gender: student.gender,
                                    departmentName: student.department.name,
                                    period: student.period,
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
                  <Button onClick={handlePrev} disabled={page <= 1} mr={2}>
                    Geri
                  </Button>
                  <>
                    {page}/{maxPage}
                  </>
                  <Button
                    onClick={handleNext}
                    disabled={page >= maxPage}
                    ml={2}
                  >
                    İleri
                  </Button>
                </>
              ) : (
                <Box textAlign="center" p={5}>
                  Hiçbir Öğrenci Bulunamadı!
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
