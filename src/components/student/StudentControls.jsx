import React, { useState } from "react";
import { Button, Stack, Box } from "@chakra-ui/react";
import StudentForm from "./StudentForm";

function StudentControls({
  onStudentAdded,
  onStudentDeleted,
  onInspectCourses,
  onResetSelected,
  Toast,
}) {
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
        Öğrenci Kontrolü
      </Button>
      {showButtons && (
        <>
          <Button colorScheme="green" onClick={toggleFormVisibility}>
            Ekle
          </Button>
          <Button colorScheme="red" onClick={onStudentDeleted}>
            Sil
          </Button>
          <Button colorScheme="teal" onClick={onInspectCourses}>
            Ders Atama
          </Button>
          <Button colorScheme="orange" onClick={onResetSelected}>
            Ders Sıfırlama
          </Button>
        </>
      )}
      <Box position={"absolute"} borderRadius={"md"} backgroundColor="teal">
        {showForm && (
          <StudentForm
            onClose={toggleFormVisibility}
            onStudentAdded={onStudentAdded}
            Toast={Toast}
          />
        )}
      </Box>
    </Stack>
  );
}

export default StudentControls;
