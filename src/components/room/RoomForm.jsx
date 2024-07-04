import React from "react";
import {
  Button,
  Stack,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
  Select,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";

function RoomForm({ onClose, onRoomAdded, Toast }) {
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
    <Stack
      bg={useColorModeValue("gray.100", "gray.900")}
      spacing={3}
      borderRadius={"md"}
      p={2}
    >
      <FormControl>
        <FormLabel htmlFor="room-code" textAlign={"center"}>
          Oda Kodu
        </FormLabel>
        <Input
          id="room-code"
          textAlign={"center"}
          onChange={(e) => handleInputChange(e, "code")}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="room-recommendedCapacity" textAlign={"center"}>
          Önerilen Kapasite
        </FormLabel>
        <Input
          id="room-recommendedCapacity"
          textAlign={"center"}
          onChange={(e) => handleInputChange(e, "recommendedCapacity")}
        />
      </FormControl>
      <Button variant="solid" colorScheme="teal" onClick={handleAddClick}>
        Ekle
      </Button>
      {onClose && (
        <Button variant="solid" colorScheme="teal" onClick={onClose}>
          İptal
        </Button>
      )}
    </Stack>
  );
}

export default RoomForm;
