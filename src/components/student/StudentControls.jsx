import React, { useState } from "react";
import {
  Button,
  Stack,
  Box,
  MenuList,
  MenuItem,
  MenuButton,
  Menu,
  MenuGroup,
  MenuDivider,
  IconButton,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import StudentForm from "./StudentForm";

function StudentControls({
  onStudentAdded,
  onStudentDeleted,
  onInspectSections,
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
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<HamburgerIcon />}
          variant="outline"
        />
        <MenuList minWidth={"30px"}>
          <MenuGroup title="Öğrenci Kontrolü" />
          <MenuItem onClick={toggleFormVisibility}>Ekle</MenuItem>
          <MenuItem onClick={onStudentDeleted}>Sil</MenuItem>
          <MenuDivider />
          <MenuGroup title="Ders Kontrolü" />
          <MenuItem onClick={onInspectSections}>Ders Atama</MenuItem>
          <MenuItem onClick={onResetSelected}>Ders Sıfırlama</MenuItem>
        </MenuList>
      </Menu>
      <Box position={"absolute"} borderRadius={"md"} backgroundColor="teal">
        {showForm && (
          <StudentForm
            isOpen={showForm}
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
