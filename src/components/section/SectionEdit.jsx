import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Select,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

function SectionEdit({ isOpen, onClose, sectionData, fetchSections, Toast }) {
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(
    sectionData.facultyID || ""
  );
  const [section, setSection] = useState(sectionData);
  const courseInputRef = useRef(null);
  const instructorInputRef = useRef(null);

  useEffect(() => {
    fetchCourses(selectedFaculty);
    fetchInstructors(selectedFaculty);
  }, [selectedFaculty]);

  useEffect(() => {
    if (courses.length > 0 && instructors.length > 0) {
      var x = courseInputRef.current.value;
      console.log("SETTING courseCode value to: " + x);
      setSection({
        ...section,
        courseCode: courseInputRef.current.value,
        instructorNo: instructorInputRef.current.value,
      });
    }
  }, [instructors || courses]);

  useEffect(() => {
    console.log("Setting section to: ", section);
  }, [section]);

  useEffect(() => {
    setSection(sectionData);
    fetchFaculties();
    fetchRooms();
    if (selectedFaculty) {
      fetchCourses(selectedFaculty);
      fetchInstructors(selectedFaculty);
    }
  }, [isOpen]);

  const fetchFaculties = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/faculties`);
      setFaculties(response.data.data);
    } catch (error) {
      console.error("Failed to fetch faculties:", error);
    }
  };

  const fetchCourses = async (facultyID) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/courses/faculty/${facultyID}`
      );
      setCourses(response.data.data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const fetchInstructors = async (facultyID) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/instructors/faculty/${facultyID}`
      );
      setInstructors(response.data.data);
    } catch (error) {
      console.error("Failed to fetch instructors:", error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/rooms`);
      setRooms(response.data.data);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    }
  };

  const handleFacultyChange = (e) => {
    const { name, value } = e.target;

    setSelectedFaculty(e.target.value);
    setSection({
      ...section,
      [name]: value,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "hour-from") {
      setSection({
        ...section,
        hour: value + "-" + section.hour.split("-")[1],
      });
    } else if (name === "hour-to") {
      setSection({
        ...section,
        hour: section.hour.split("-")[0] + "-" + value,
      });
    } else setSection({ ...section, [name]: value });
    console.log(section);
  };

  const handleNumberInputChange = (field, e) => {
    setSection({ ...section, [field]: e });
  };

  const updateSection = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/section/${section.id}`,
        section
      );
      if (response.status === 200) {
        onClose();
        fetchSections();
        Toast("Başarıyla Güncellendi!", "success");
      }
    } catch (error) {
      Toast("Hata!", "error");
      console.error("Failed to update section:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sınıfı Düzenle</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Fakülte</FormLabel>
            <Select
              name="facultyID"
              value={section.facultyID}
              onChange={handleFacultyChange}
            >
              {faculties.map((faculty) => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Ders</FormLabel>
            <Select
              isDisabled={courses.length === 0}
              onChange={handleInputChange}
              name="courseCode"
              value={section.courseCode}
              ref={courseInputRef}
            >
              {courses.map((course) => (
                <option key={course.code}>{course.code}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Öğretim Üyesi</FormLabel>
            <Select
              isDisabled={instructors.length === 0}
              name="instructorNo"
              onChange={handleInputChange}
              value={section.instructorNo}
              ref={instructorInputRef}
            >
              {instructors.map((instructor) => (
                <option
                  key={instructor.instructorNo}
                  value={instructor.instructorNo}
                >
                  {instructor.firstName} {instructor.lastName}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="section-day">Gün</FormLabel>
            <Select
              id="section-day"
              variant="filled"
              name="day"
              onChange={handleInputChange}
              value={section.day}
            >
              <option value="M">Pazartesi</option>
              <option value="T">Salı</option>
              <option value="W">Çarşamba</option>
              <option value="TH">Perşembe</option>
              <option value="F">Cuma</option>
            </Select>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="section-time">Zaman</FormLabel>
            <Input
              id="section-to-time"
              type="time"
              colorScheme="teal"
              name="hour-from"
              onChange={handleInputChange}
              value={section.hour.split("-")[0]}
            />
            -
            <Input
              id="section-from-time"
              type="time"
              colorScheme="teal"
              name="hour-to"
              onChange={handleInputChange}
              value={section.hour.split("-")[1]}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="section-roomNo">Sınıf</FormLabel>
            <Select
              id="course-code-select"
              variant="filled"
              name="roomNo"
              value={section.roomNo}
              onChange={handleInputChange}
            >
              {rooms.map((room) => (
                <option key={room.code} value={room.code}>
                  {room.code}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="capacity">Kapasite</FormLabel>
            <NumberInput
              id="capacity"
              name="capacity"
              defaultValue={section.capacity}
              min={section.noStudents}
              onChange={(value) => handleNumberInputChange("capacity", value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="noStudents">Öğrenci Sayısı</FormLabel>
            <NumberInput
              id="noStudents"
              name="noStudents"
              defaultValue={section.noStudents}
              min={0}
              max={section.capacity}
              onChange={(value) => handleNumberInputChange("noStudents", value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} colorScheme="blue" onClick={updateSection}>
            Kaydet
          </Button>
          <Button onClick={onClose}>Kapat</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default SectionEdit;
