import React, { useState } from "react";
import { Button, Stack, Box } from "@chakra-ui/react";
import FacultyForm from "./FacultyForm";

function FacultyControls({ onFacultyAdded, onFacultyDeleted, Toast }) {
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
        Fakülte Kontrolü
      </Button>
      {showButtons && (
        <>
          <Button colorScheme="green" onClick={toggleFormVisibility}>
            Ekle
          </Button>
          <Button colorScheme="red" onClick={onFacultyDeleted}>
            Sil
          </Button>
        </>
      )}
      <Box position={"absolute"} borderRadius={"md"}>
        {showForm && (
          <FacultyForm
            isOpen={showForm}
            onClose={toggleFormVisibility}
            onFacultyAdded={onFacultyAdded}
            Toast={Toast}
          />
        )}
      </Box>
    </Stack>
  );
}

export default FacultyControls;
