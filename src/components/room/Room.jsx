import RoomControls from "./RoomControls";
import RoomEdit from "./RoomEdit";

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

function Room() {
  const toast = useToast();
  const toastIdRef = React.useRef();

  const [rooms, setRooms] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [checkedState, setCheckedState] = useState([]);
  const [checkedIDs, setCheckedIDs] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [roomData, setRoomData] = useState({});

  function Toast(e, status) {
    toastIdRef.current = toast({
      title: e,
      status: status,
      isClosable: true,
    });
  }

  const fetchRooms = async () => {
    setIsLoaded(false);
    try {
      const response = await axios.get(`http://localhost:3000/rooms`);
      const data = response.data.data;
      setRooms(data);
      setIsLoaded(true);
    } catch (error) {
      Toast("Bağlantı Hatası!", "error");
      console.error("Failed to fetch rooms:", error);
      setTimeout(fetchRooms, 5000);
    }
  };

  const deleteSelected = async () => {
    try {
      const deletePromises = checkedIDs.map((roomID) =>
        fetch(`http://localhost:3000/room/${roomID}`, {
          method: "DELETE",
        })
      );
      const responses = await Promise.all(deletePromises);

      responses.forEach((response) => {
        if (!response.ok) {
          console.error(
            `Failed to delete room with ID: ${response.url.split("/").pop()}`
          );
        }
      });
      fetchRooms();
      setCheckedIDs([]);
      Toast("Başarıyla Silindi!", "success");
    } catch (error) {
      Toast("Hata!", "error");
      console.error("Error deleting selected rooms:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    setCheckedState(new Array(rooms.length).fill(false));
  }, [rooms]);

  const handleSelectAll = () => {
    const allChecked = checkedState.every(Boolean);
    const newState = new Array(rooms.length).fill(!allChecked);
    setCheckedState(newState);

    const newCheckedIDs = !allChecked ? rooms.map((room) => room.id) : [];
    setCheckedIDs(newCheckedIDs);
  };

  const handleCheck = (position, roomID) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);

    const updatedCheckedIDs = [...checkedIDs];
    if (updatedCheckedState[position]) {
      updatedCheckedIDs.push(roomID);
    } else {
      const index = updatedCheckedIDs.indexOf(roomID);
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
            <RoomControls
              onRoomAdded={fetchRooms}
              onRoomDeleted={deleteSelected}
              Toast={Toast}
            />
          </Box>
          <Box position={"absolute"} borderRadius={"md"}>
            <RoomEdit
              isOpen={isOpen}
              onClose={onClose}
              roomData={roomData}
              fetchRooms={fetchRooms}
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
              {rooms.length !== 0 ? (
                <TableContainer>
                  <Table variant="striped" colorScheme="teal">
                    <TableCaption>Derslikler</TableCaption>
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
                        <Th textAlign={"center"}>Oda Kodu</Th>
                        <Th textAlign={"center"}>Önerilen Kapasite</Th>
                        <Th textAlign={"center"}>ID</Th>
                        <Th textAlign={"center"}>Düzenle</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {rooms.map((room, index) => (
                        <Tr key={room.id}>
                          <Td textAlign={"center"}>
                            <Checkbox
                              isChecked={checkedState[index]}
                              onChange={() => handleCheck(index, room.id)}
                            />
                          </Td>
                          <Td textAlign={"center"}>{room.code}</Td>
                          <Td textAlign={"center"}>
                            {room.recommendedCapacity}
                          </Td>
                          <Td textAlign={"center"}>{room.id}</Td>
                          <Td textAlign={"center"}>
                            <Button
                              onClick={() => {
                                onOpen();
                                setRoomData(room);
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
                  Hiçbir Derslik Eklenmedi!
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

export default Room;
