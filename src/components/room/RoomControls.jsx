import React, { useState } from "react";
import { Button, Stack, Box } from "@chakra-ui/react";
import RoomForm from "./RoomForm";

function RoomControls({ onRoomAdded, onRoomDeleted, Toast }) {
  const [showButtons, setShowButtons] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleEditClick = () => {
    setShowButtons(!showButtons);
  };

  const toggleFormVisibility = () => {
    setShowForm((prevShowForm) => {
      if (!prevShowForm) {
        setShowButtons(false);
      }
      return !prevShowForm;
    });
  };

  return (
    <Stack direction="column" spacing={2} align="center">
      <Button colorScheme="blue" onClick={handleEditClick}>
        Derslik Kontrolü
      </Button>
      {showButtons && (
        <>
          <Button colorScheme="green" onClick={toggleFormVisibility}>
            Ekle
          </Button>
          <Button colorScheme="red" onClick={onRoomDeleted}>
            Sil
          </Button>
        </>
      )}
      <Box position={"absolute"} borderRadius={"md"}>
        {showForm && (
          <RoomForm
            onClose={toggleFormVisibility}
            onRoomAdded={onRoomAdded}
            Toast={Toast}
          />
        )}
      </Box>
    </Stack>
  );
}

export default RoomControls;
