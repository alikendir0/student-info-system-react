import React, { useState } from "react";
import { Button, Stack, Box } from "@chakra-ui/react";
import DepartmentForm from "./DepartmentForm";

function DepartmentControls({ onDepartmentAdded, onDepartmentDeleted, Toast }) {
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
        Bölüm Kontrolü
      </Button>
      {showButtons && (
        <>
          <Button colorScheme="green" onClick={toggleFormVisibility}>
            Ekle
          </Button>
          <Button colorScheme="red" onClick={onDepartmentDeleted}>
            Sil
          </Button>
        </>
      )}
      <Box position={"absolute"} borderRadius={"md"}>
        {showForm && (
          <DepartmentForm
            isOpen={showForm}
            onClose={toggleFormVisibility}
            onDepartmentAdded={onDepartmentAdded}
            Toast={Toast}
          />
        )}
      </Box>
    </Stack>
  );
}

export default DepartmentControls;
