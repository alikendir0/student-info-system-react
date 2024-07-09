import React from "react";
import {
  Button,
  Stack,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";

function RoomForm({ isOpen, onClose, onRoomAdded, Toast }) {
  const [roomData, setRoomData] = useState({
    code: "",
    recommendedCapacity: "",
  });
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchRooms = async () => {
    setIsLoaded(false);
    try {
      const response = await axios.get(`http://localhost:3000/rooms`);
      const data = response.data.data;
      setRooms(data);
      setIsLoaded(true);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
      setTimeout(fetchRooms, 5000);
    }
  };

  const handleAddClick = () => {
    axios
      .post("http://localhost:3000/room", roomData)
      .then((response) => {
        console.log(response.data);
        onRoomAdded();
        Toast("Başarıyla Eklendi!", "success");
      })
      .catch((error) => {
        Toast(error.response.data.message, "error");
        console.error(error);
      });
  };

  const handleInputChange = (e, property) => {
    const value = e.target.value;
    setRoomData({
      ...roomData,
      [property]: value,
    });
  };

  useEffect(() => {
    fetchRooms();
    console.log(roomData);
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Derslik Ekle</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel htmlFor="room-code">Oda Kodu</FormLabel>
            <Input
              id="room-code"
              onChange={(e) => handleInputChange(e, "code")}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="room-recommendedCapacity">
              Önerilen Kapasite
            </FormLabel>
            <Input
              id="room-recommendedCapacity"
              onChange={(e) => handleInputChange(e, "recommendedCapacity")}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="solid"
            colorScheme="teal"
            onClick={handleAddClick}
            mr={3}
          >
            Ekle
          </Button>
          {onClose && (
            <Button variant="solid" colorScheme="teal" onClick={onClose}>
              İptal
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default RoomForm;
