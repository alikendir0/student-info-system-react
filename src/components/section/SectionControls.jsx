import React, { useState } from "react";
import { Button, Stack, Box } from "@chakra-ui/react";
import SectionForm from "./SectionForm";

function SectionControls({ onSectionAdded, onSectionDeleted, Toast }) {
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
        Sınıf Kontrolü
      </Button>
      {showButtons && (
        <>
          <Button colorScheme="green" onClick={toggleFormVisibility}>
            Ekle
          </Button>
          <Button colorScheme="red" onClick={onSectionDeleted}>
            Sil
          </Button>
        </>
      )}
      <Box position={"absolute"} borderRadius={"md"}>
        {showForm && (
          <SectionForm
            isOpen={showForm}
            onClose={toggleFormVisibility}
            onSectionAdded={onSectionAdded}
            Toast={Toast}
          />
        )}
      </Box>
    </Stack>
  );
}

export default SectionControls;
