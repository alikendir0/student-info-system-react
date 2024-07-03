import React from "react";
import {
  Button,
  Stack,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

function SectionForm({ onClose, onSectionAdded, Toast }) {
  const [sectionData, setSectionData] = useState({
    code: "",
    faculty: "",
    time: "",
    place: "",
    instructor: "",
  });

  const handleAddClick = () => {
    axios
      .post("http://localhost:3000/section", sectionData)
      .then((response) => {
        console.log(response.data);
        onSectionAdded();
        Toast("Başarıyla Eklendi!", "success");
      })
      .catch((error) => {
        Toast(error.response.data.data[0].message, "error");
        console.error(error);
      });
  };

  const handleInputChange = (e, property) => {
    setSectionData({
      ...sectionData,
      [property]: e.target.value,
    });
  };

  return (
    <Stack
      bg={useColorModeValue("gray.100", "gray.900")}
      spacing={3}
      borderRadius={"md"}
      p={2}
    >
      <FormControl>
        <FormLabel htmlFor="section-code" textAlign={"center"}>
          Ders Kodu
        </FormLabel>
        <Input
          id="section-code"
          type="text"
          colorScheme="teal"
          textAlign={"center"}
          borderWidth="2px"
          onChange={(e) => handleInputChange(e, "code")}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="section-faculty" textAlign={"center"}>
          Fakülte
        </FormLabel>
        <Input
          id="section-faculty"
          type="text"
          colorScheme="teal"
          textAlign={"center"}
          borderWidth="2px"
          onChange={(e) => handleInputChange(e, "faculty")}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="section-time" textAlign={"center"}>
          Zaman
        </FormLabel>
        <Input
          id="section-time"
          type="text"
          colorScheme="teal"
          textAlign={"center"}
          borderWidth="2px"
          onChange={(e) => handleInputChange(e, "time")}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="section-place" textAlign={"center"}>
          Sınıf
        </FormLabel>
        <Input
          id="section-place"
          type="text"
          colorScheme="teal"
          textAlign={"center"}
          borderWidth="2px"
          onChange={(e) => handleInputChange(e, "place")}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="section-instructor" textAlign={"center"}>
          Öğretim Görevlisi
        </FormLabel>
        <Input
          id="section-instructor"
          type="text"
          colorScheme="teal"
          textAlign={"center"}
          borderWidth="2px"
          onChange={(e) => handleInputChange(e, "instructor")}
        />
      </FormControl>
      <Button variant="solid" colorScheme="teal" onClick={handleAddClick}>
        Kaydet
      </Button>
      {onClose && (
        <Button variant="solid" colorScheme="teal" onClick={onClose}>
          İptal
        </Button>
      )}
    </Stack>
  );
}

export default SectionForm;
