import React, { useState } from "react";
import { Button, Stack, Box } from "@chakra-ui/react";
import StudentForm from "./StudentForm";

function StudentControls({ onStudentAdded }) {
  const [showButtons, setShowButtons] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleEditClick = () => {
    setShowButtons(!showButtons);
  };

  const toggleFormVisibility = () => {
    setShowForm((prevShowForm) => {
      if (!prevShowForm) {
        // If the form is about to be shown
        setShowButtons(false); // Hide the buttons
      }
      return !prevShowForm;
    });
  };

  return (
    <Stack direction="column" spacing={2} align="center">
      <Button colorScheme="blue" onClick={handleEditClick}>
        Öğrenci Kontrolü
      </Button>
      {showButtons && (
        <>
          <Button colorScheme="green" onClick={toggleFormVisibility}>
            Ekle
          </Button>
          <Button colorScheme="red">Sil</Button>
          <Button colorScheme="teal">Ders Atama</Button>
        </>
      )}
      <Box
        position={"absolute"}
        borderRadius={"md"}
        backgroundColor="rgba(192,243,234,255)"
      >
        {showForm && (
          <StudentForm
            onClose={toggleFormVisibility}
            onStudentAdded={onStudentAdded}
          />
        )}
      </Box>
    </Stack>
  );
}

export default StudentControls;
