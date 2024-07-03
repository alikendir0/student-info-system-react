import React from "react";
import {
  Button,
  Stack,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
  Select,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";

function SectionForm({ onClose, onSectionAdded, Toast }) {
  const [sectionData, setSectionData] = useState({
    courseCode: "",
    day: "",
    hour: "",
    place: "",
    capacity: "",
    noStudents: "",
    instructor: {
      firstName: "",
      lastName: "",
    },
  });
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleAddClick = () => {
    axios
      .post("http://localhost:3000/section", sectionData)
      .then((response) => {
        console.log(response.data);
        onSectionAdded();
        Toast("Başarıyla Eklendi!", "success");
      })
      .catch((error) => {
        Toast(error.response.data.message, "error");
        console.error(error);
      });
  };

  const handleInputChange = (e, property) => {
    const value = e.target.value;
    if (property === "time") {
      const fromTime = document.getElementById("section-from-time").value;
      const toTime = document.getElementById("section-to-time").value;
      const timeValue =
        e.target.id === "section-from-time"
          ? `${fromTime}-${toTime || "??"}`
          : `${toTime}-${fromTime || "??"}`;
      setSectionData({
        ...sectionData,
        hour: timeValue,
      });
    } else if (property === "faculty") {
      fetchCourses(value);
    } else {
      setSectionData({
        ...sectionData,
        [property]: value,
      });
    }
  };

  const fetchFaculties = async () => {
    setIsLoaded(false);
    try {
      const response = await axios.get(`http://localhost:3000/faculties`);
      const data = response.data.data;
      setFaculties(data);
      setIsLoaded(true);
    } catch (error) {
      console.error("Failed to fetch faculties:", error);
      setTimeout(fetchFaculties, 5000);
    }
  };

  const fetchCourses = async (facultyId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/courses/faculty/${facultyId}`
      );
      const data = response.data.data;
      setCourses(data);
      setSelectedFaculty(false);
      if (data.length > 0) setSelectedFaculty(true);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const fetchInstructors = async () => {
    setIsLoaded(false);
    try {
      const response = await axios.get(`http://localhost:3000/instructors`);
      const data = response.data.data;
      setInstructors(data);
      setIsLoaded(true);
    } catch (error) {
      console.error("Failed to fetch instructors:", error);
      setTimeout(fetchInstructors, 5000);
    }
  };

  useEffect(() => {
    fetchFaculties();
    fetchInstructors();
  }, []);

  return (
    <Stack
      bg={useColorModeValue("gray.100", "gray.900")}
      spacing={3}
      borderRadius={"md"}
      p={2}
    >
      <FormControl>
        <FormLabel htmlFor="section-code" textAlign={"center"}>
          Fakülte
        </FormLabel>
        <Select
          id="faculty-select"
          variant="filled"
          placeholder="Fakülte"
          onChange={(e) => handleInputChange(e, "faculty")}
        >
          {faculties.map((faculty) => (
            <option key={faculty.id} value={faculty.id}>
              {faculty.name}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="section-code" textAlign={"center"}>
          Ders Kodu
        </FormLabel>
        <Select
          id="course-code-select"
          variant="filled"
          placeholder="Ders Kodu"
          disabled={!selectedFaculty}
          onChange={(e) => handleInputChange(e, "courseCode")}
        >
          {courses.map((course) => (
            <option key={course.id} value={course.code}>
              {course.code}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="section-day" textAlign={"center"}>
          Gün
        </FormLabel>
        <Select
          id="section-day"
          variant="filled"
          placeholder="Gün"
          onChange={(e) => handleInputChange(e, "day")}
        >
          <option value="M">Pazartesi</option>
          <option value="T">Salı</option>
          <option value="W">Çarşamba</option>
          <option value="TH">Perşembe</option>
          <option value="F">Cuma</option>
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="section-time" textAlign={"center"}>
          Zaman
        </FormLabel>
        <Input
          id="section-to-time"
          type="time"
          colorScheme="teal"
          textAlign={"center"}
          borderWidth="2px"
          onChange={(e) => handleInputChange(e, "time")}
        />
        -
        <Input
          id="section-from-time"
          type="time"
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
        <FormLabel htmlFor="section-capacity" textAlign={"center"}>
          Kapasite
        </FormLabel>
        <Input
          id="section-capacity"
          type="text"
          colorScheme="teal"
          textAlign={"center"}
          borderWidth="2px"
          onChange={(e) => handleInputChange(e, "capacity")}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="section-noStudents" textAlign={"center"}>
          Mevcut Öğrenci Sayısı
        </FormLabel>
        <Input
          id="section-noStudents"
          type="text"
          colorScheme="teal"
          textAlign={"center"}
          borderWidth="2px"
          onChange={(e) => handleInputChange(e, "noStudents")}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="section-instructor" textAlign={"center"}>
          Öğretim Görevlisi
        </FormLabel>
        <Select
          id="instructor-select"
          variant="filled"
          placeholder="Öğretim Görevlisi"
          onChange={(e) =>
            setSectionData({
              ...sectionData,
              instructor: instructors.find(
                (instructor) => instructor.id === e.target.value
              ),
            })
          }
        >
          {instructors.map((instructor) => (
            <option key={instructor.id} value={instructor.id}>
              {instructor.firstName} {instructor.lastName}
            </option>
          ))}
        </Select>
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
