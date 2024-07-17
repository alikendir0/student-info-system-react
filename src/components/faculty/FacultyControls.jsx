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
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<HamburgerIcon />}
          variant="outline"
        />
        <MenuList minWidth={"30px"}>
          <MenuGroup title="Fakülte Kontrolü" />
          <MenuItem onClick={toggleFormVisibility}>Ekle</MenuItem>
          <MenuItem onClick={onFacultyDeleted}>Sil</MenuItem>
        </MenuList>
      </Menu>
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
