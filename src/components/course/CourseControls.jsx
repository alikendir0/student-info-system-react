import React, { useState } from "react";
import {
  Button,
  Stack,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  IconButton,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
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
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<HamburgerIcon />}
          variant="outline"
        />
        <MenuList minWidth={"30px"}>
          <MenuGroup title="Ders Kontrolü" />
          <MenuItem onClick={toggleFormVisibility}>Ekle</MenuItem>
          <MenuItem onClick={onCourseDeleted}>Sil</MenuItem>
        </MenuList>
      </Menu>
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
