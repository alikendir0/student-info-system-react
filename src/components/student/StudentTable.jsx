import {
  Box,
  Flex,
  Table,
  TableCaption,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Checkbox,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

const StudentTable = ({ students }) => {
  const [checkedState, setCheckedState] = useState([]);
  const [checkedIDs, setCheckedIDs] = useState([]);

  useEffect(() => {
    setCheckedState(new Array(students.length).fill(false));
  }, [students]);

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
    console.log(updatedCheckedIDs);
  };

  const deleteSelected = async () => {
    try {
      const deletePromises = updatedCheckedIDs.map((studentID) =>
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
      console.log("All selected students have been deleted successfully.");
    } catch (error) {
      console.error("Error deleting selected students:", error);
    }
  };

  return (
    <Flex
      mt={16}
      justifyContent="center"
      alignItems="flex-start"
      height="100vh"
    >
      <Box mt={16}>
        <TableContainer>
          <Table variant="striped" colorScheme="teal">
            <TableCaption> Öğrenci Listesi</TableCaption>
            <Thead>
              <Tr>
                <Th>
                  <button
                    onClick={handleSelectAll}
                    className="select-all-button"
                    type="button"
                  >
                    Hepsini Seç
                  </button>
                </Th>
                <Th>Ad</Th>
                <Th>Soyad</Th>
                <Th>T.C. Kimlik Numarası</Th>
                <Th>Öğrenci Numarası</Th>
              </Tr>
            </Thead>
            <Tbody>
              {students.map((student, index) => (
                <Tr key={student.idNo}>
                  <Td>
                    <Checkbox
                      isChecked={checkedState[index]}
                      onChange={() => handleCheck(index, student.idNo)}
                    />
                  </Td>
                  <Td>{student.fistName}</Td>
                  <Td>{student.lastName}</Td>
                  <Td>{student.idNo}</Td>
                  <Td>{student.studentNo}</Td>
                  <Td>
                    <button className="dersler" type="button">
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
  );
};

export default StudentTable;
