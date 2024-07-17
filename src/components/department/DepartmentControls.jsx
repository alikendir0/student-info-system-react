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
  IconButton,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
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
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<HamburgerIcon />}
          variant="outline"
        />
        <MenuList minWidth={"30px"}>
          <MenuGroup title="Bölüm Kontrolü" />
          <MenuItem onClick={toggleFormVisibility}>Ekle</MenuItem>
          <MenuItem onClick={onDepartmentDeleted}>Sil</MenuItem>
        </MenuList>
      </Menu>
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
