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
  Stack,
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
    setSection({ ...section, [name]: value });
    console.log(section);
  };

  const handleSessionChange = (e, index) => {
    const { name, value } = e.target;

    const sessions = section["section-sessions"];
    if (name === "hour-from")
      sessions[index] = {
        ...sessions[index],
        hour:
          value + "-" + section["section-sessions"][index].hour.split("-")[1],
      };
    else if (name === "hour-to")
      sessions[index] = {
        ...sessions[index],
        hour:
          section["section-sessions"][index].hour.split("-")[0] + "-" + value,
      };
    else sessions[index] = { ...sessions[index], [name]: value };
    setSection({ ...section, ["section-sessions"]: sessions });
    console.log(section);
  };

  const addSession = () => {
    const sessions = section["section-sessions"];
    const maxId = sessions.reduce(
      (max, session) => Math.max(max, session.id),
      0
    );
    sessions.push({
      id: maxId + 1,
      day: "",
      hour: "",
      roomNo: "",
    });
    setSection({ ...section, ["section-sessions"]: sessions });
  };

  const deleteSession = async (id) => {
    if (section["section-sessions"].length === 1) {
      Toast("Bir sınıfın en az bir oturumu olmalı!", "error");
      return;
    }
    const sessions = section["section-sessions"];
    const newSessions = sessions.filter((session) => session.id !== id);
    console.log(newSessions);
    setSection({ ...section, ["section-sessions"]: newSessions });
  };

  const handleNumberInputChange = (field, e) => {
    setSection({ ...section, [field]: e });
  };

  const updateSection = async () => {
    axios
      .put(`http://localhost:3000/section/${section.id}`, section)
      .then((response) => {
        onClose();
        fetchSections();
        Toast("Başarıyla Güncellendi!", "success");
      })
      .catch((error) => {
        Toast(error.response.data.message, "error");
        console.error("Failed to update section:", error);
      });
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
          {Array.from(section["section-sessions"]).map((session, index) => (
            <Stack key={session.id} spacing={4}>
              <FormControl mb={4}>
                <FormLabel>
                  <Stack direction="row">
                    <>Oturum {index + 1}</>
                    <button
                      onClick={addSession}
                      className="select-all-button"
                      type="button"
                    >
                      +
                    </button>
                    <button
                      onClick={() => deleteSession(session.id)}
                      className="select-all-button"
                      type="button"
                    >
                      -
                    </button>
                  </Stack>
                </FormLabel>
                <FormLabel mt={4} htmlFor="session-day">
                  Gün
                </FormLabel>
                <Select
                  id="session-day"
                  variant="filled"
                  name="day"
                  placeholder="Gün Seçin"
                  onChange={(e) => handleSessionChange(e, index)}
                  value={session.day}
                >
                  <option value="M">Pazartesi</option>
                  <option value="T">Salı</option>
                  <option value="W">Çarşamba</option>
                  <option value="TH">Perşembe</option>
                  <option value="F">Cuma</option>
                </Select>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel htmlFor="session-time">Zaman</FormLabel>
                <Input
                  id="session-to-time"
                  type="time"
                  colorScheme="teal"
                  name="hour-from"
                  onChange={(e) => handleSessionChange(e, index)}
                  value={session.hour ? session.hour.split("-")[0] : ""}
                />
                -
                <Input
                  id="session-from-time"
                  type="time"
                  colorScheme="teal"
                  name="hour-to"
                  onChange={(e) => handleSessionChange(e, index)}
                  value={session.hour ? session.hour.split("-")[1] : ""}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel htmlFor="session-roomNo">Derslik</FormLabel>
                <Select
                  id="course-code-select"
                  variant="filled"
                  name="roomNo"
                  placeholder="Derslik Seçin"
                  mb={4}
                  value={session.roomNo}
                  onChange={(e) => handleSessionChange(e, index)}
                >
                  {rooms.map((room) => (
                    <option key={room.code} value={room.code}>
                      {room.code}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          ))}
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
