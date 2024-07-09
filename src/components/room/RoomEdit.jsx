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
  Select,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form } from "react-router-dom";

function RoomEdit({ isOpen, onClose, roomData, fetchRooms, Toast }) {
  const [room, setRoom] = useState({});
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    setRoom(roomData);
  }, [roomData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoom({ ...room, [name]: value });
    console.log(room);
  };

  useEffect(() => {
    setRoom(roomData);
  }, [roomData]);

  const updateRoom = async () => {
    console.log(roomData);
    try {
      const response = await axios.put(
        `http://localhost:3000/room/${room.id}`,
        room
      );
      if (response.status === 200) {
        onClose();
        fetchRooms();
        Toast("Başarıyla Güncellendi!", "success");
      }
    } catch (error) {
      Toast("Hata!", "error");
      console.error("Error updating room:", error);
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Derslik Düzenle</ModalHeader>
          <ModalCloseButton />
          {room.id ? (
            <ModalBody>
              <FormControl id="id" mb={4}>
                <FormLabel>Room ID</FormLabel>
                <Input
                  disabled={true}
                  type="text"
                  name="id"
                  value={room.id}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl id="code" mb={4}>
                <FormLabel>Derslik Kodu</FormLabel>
                <Input
                  type="text"
                  name="code"
                  value={room.code}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl id="recommendedCapacity" mb={4}>
                <FormLabel>Önerilen Kapasite</FormLabel>
                <Input
                  type="text"
                  name="recommendedCapacity"
                  value={room.recommendedCapacity}
                  onChange={handleInputChange}
                />
              </FormControl>
            </ModalBody>
          ) : (
            <Spinner />
          )}
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={updateRoom}>
              Kaydet
            </Button>
            <Button onClick={onClose}>Kapat</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default RoomEdit;
