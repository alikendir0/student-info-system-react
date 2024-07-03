import SectionControls from "./SectionControls";

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
  Spinner,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import axios from "axios";

function Section() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [sections, setSections] = useState([]);
  const [checkedState, setCheckedState] = useState([]);
  const [checkedIDs, setCheckedIDs] = useState([]);

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
    fetchSections();
  }, []);

  useEffect(() => {
    setCheckedState(new Array(sections.length).fill(false));
  }, [sections]);

  const fetchSections = async () => {
    setIsLoaded(false);
    try {
      const response = await axios.get(`http://localhost:3000/sections`);
      const data = response.data.data;
      setSections(data);
      setIsLoaded(true);
    } catch (error) {
      Toast("Bağlantı Hatası!", "error");
      console.error("Failed to fetch sections:", error);
      setTimeout(fetchSections, 5000);
    }
  };

  const handleSelectAll = () => {
    const allChecked = checkedState.every(Boolean);
    const newState = new Array(sections.length).fill(!allChecked);
    setCheckedState(newState);

    const newCheckedIDs = !allChecked
      ? sections.map((section) => section.id)
      : [];
    setCheckedIDs(newCheckedIDs);
  };

  const handleCheck = (position, sectionID) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);

    const updatedCheckedIDs = [...checkedIDs];
    if (updatedCheckedState[position]) {
      updatedCheckedIDs.push(sectionID);
    } else {
      const index = updatedCheckedIDs.indexOf(sectionID);
      if (index > -1) {
        updatedCheckedIDs.splice(index, 1);
      }
    }
    setCheckedIDs(updatedCheckedIDs);
  };

  const deleteSelected = async () => {
    try {
      const deletePromises = checkedIDs.map((sectionID) =>
        fetch(`http://localhost:3000/section/${sectionID}`, {
          method: "DELETE",
        })
      );
      const responses = await Promise.all(deletePromises);

      responses.forEach((response) => {
        if (!response.ok) {
          console.error(
            `Failed to delete section with ID: ${response.url.split("/").pop()}`
          );
        }
      });
      fetchSections();
      setCheckedIDs([]);
      Toast("Başarıyla Silindi!", "success");
    } catch (error) {
      Toast("Hata!", "error");
      console.error("Error deleting selected sections:", error);
    }
  };
  return (
    <>
      {isLoaded ? (
        <Flex direction="column" align="right" mt={8}>
          <Box position={"absolute"} alignSelf="flex-end" mr={6}>
            <SectionControls
              onSectionAdded={fetchSections}
              onSectionDeleted={deleteSelected}
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
              {sections.length !== 0 ? (
                <TableContainer>
                  <Table variant="striped" colorScheme="teal">
                    <TableCaption> Sınıf Listesi</TableCaption>
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
                        <Th textAlign={"center"}>Zaman</Th>
                        <Th textAlign={"center"}>Sınıf</Th>
                        <Th textAlign={"center"}>Öğretim Görevlisi</Th>
                        <Th textAlign={"center"}>Kapasite</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {sections.map((section, index) => (
                        <Tr key={section.id}>
                          <Td textAlign={"center"}>
                            <Checkbox
                              isChecked={checkedState[index]}
                              onChange={() => handleCheck(index, section.id)}
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
                          <Td textAlign={"center"}>
                            {section.noStudents}/{section.capacity}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              ) : (
                <Box textAlign="center" p={5}>
                  Hiçbir Sınıf Eklenmedi!
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

export default Section;
