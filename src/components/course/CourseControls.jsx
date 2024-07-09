import React, { useState } from "react";
import { Button, Stack, Box } from "@chakra-ui/react";
import CourseForm from "./CourseForm";

function CourseControls({ onCourseAdded, onCourseDeleted, Toast }) {
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
        Ders Kontrolü
      </Button>
      {showButtons && (
        <>
          <Button colorScheme="green" onClick={toggleFormVisibility}>
            Ekle
          </Button>
          <Button colorScheme="red" onClick={onCourseDeleted}>
            Sil
          </Button>
        </>
      )}
      <Box position={"absolute"} borderRadius={"md"}>
        {showForm && (
          <CourseForm
            isOpen={showForm}
            onClose={toggleFormVisibility}
            onCourseAdded={onCourseAdded}
            Toast={Toast}
          />
        )}
      </Box>
    </Stack>
  );
}

export default CourseControls;
