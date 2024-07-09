import React, { useState } from "react";
import { Button, Stack, Box } from "@chakra-ui/react";
import InstructorForm from "./InstructorForm";

function InstructorControls({ onInstructorAdded, onInstructorDeleted, Toast }) {
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
        Öğretim Üyesi Kontrolü
      </Button>
      {showButtons && (
        <>
          <Button colorScheme="green" onClick={toggleFormVisibility}>
            Ekle
          </Button>
          <Button colorScheme="red" onClick={onInstructorDeleted}>
            Sil
          </Button>
        </>
      )}
      <Box position={"absolute"} borderRadius={"md"}>
        {showForm && (
          <InstructorForm
            isOpen={showForm}
            onClose={toggleFormVisibility}
            onInstructorAdded={onInstructorAdded}
            Toast={Toast}
          />
        )}
      </Box>
    </Stack>
  );
}

export default InstructorControls;
