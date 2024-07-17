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
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<HamburgerIcon />}
          variant="outline"
        />
        <MenuList minWidth={"30px"}>
          <MenuGroup title="Öğretim Üyesi Kontrolü" />
          <MenuItem onClick={toggleFormVisibility}>Ekle</MenuItem>
          <MenuItem onClick={onInstructorDeleted}>Sil</MenuItem>
        </MenuList>
      </Menu>
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
