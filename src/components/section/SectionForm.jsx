import React from "react";
import {
  Button,
  Stack,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";

function SectionForm({ isOpen, onClose, onSectionAdded, Toast }) {
  const [sectionData, setSectionData] = useState({
    courseCode: "",
    capacity: "",
    noStudents: "",
    instructorNo: "",
    "section-sessions": [
      {
        id: 0,
        day: "",
        hour: "",
        roomNo: "",
      },
    ],
  });
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [recommendedCapacity, setRecommendedCapacity] = useState("");

  const handleAddClick = () => {
    console.log(sectionData);
    axios
      .post("http://localhost:3000/section", sectionData)
      .then((response) => {
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
      fetchInstructors(value);
    } else {
      if (property === "roomNo")
        setRecommendedCapacity(
          rooms.find((room) => room.code === value).recommendedCapacity
        );
      setSectionData({
        ...sectionData,
        [property]: value,
      });
    }
  };

  const handleSessionChange = (e, index) => {
    const { name, value } = e.target;
    const sessions = sectionData["section-sessions"];
    console.log(value);
    if (name === "hour-from")
      sessions[index] = {
        ...sessions[index],
        hour:
          value +
          "-" +
          sectionData["section-sessions"][index].hour.split("-")[1],
      };
    else if (name === "hour-to")
      sessions[index] = {
        ...sessions[index],
        hour:
          sectionData["section-sessions"][index].hour.split("-")[0] +
          "-" +
          value,
      };
    else sessions[index] = { ...sessions[index], [name]: value };
    setSectionData({ ...sectionData, ["section-sessions"]: sessions });
  };

  const addSession = () => {
    const sessions = sectionData["section-sessions"];
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
    setSectionData({ ...sectionData, ["section-sessions"]: sessions });
  };

  const deleteSession = async (id) => {
    if (sectionData["section-sessions"].length === 1) {
      Toast("Bir sınıfın en az bir oturumu olmalı!", "error");
      return;
    }
    const sessions = sectionData["section-sessions"];
    const newSessions = sessions.filter((session) => session.id !== id);
    console.log(sessions);
    setSectionData({ ...sectionData, ["section-sessions"]: newSessions });
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

  const fetchInstructors = async (facultyId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/instructors/faculty/${facultyId}`
      );
      const data = response.data.data;
      setInstructors(data);
      setIsLoaded(true);
    } catch (error) {
      console.error("Failed to fetch instructors:", error);
      setTimeout(fetchInstructors, 5000);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/rooms`);
      const data = response.data.data;
      setRooms(data);
      setIsLoaded(true);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
      setTimeout(fetchRooms, 5000);
    }
  };

  useEffect(() => {
    fetchFaculties();
    fetchRooms();
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Öğrenci Ekle</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel htmlFor="section-code">Fakülte</FormLabel>
            <Select
              id="faculty-select"
              variant="filled"
              placeholder="Fakülte"
              onChange={(e) => handleInputChange(e, "faculty")}
            >
              {faculties.map((faculty) => (
                <option key={faculty.name} value={faculty.id}>
                  {faculty.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="section-code">Ders Kodu</FormLabel>
            <Select
              id="course-code-select"
              variant="filled"
              placeholder="Ders Kodu"
              disabled={!selectedFaculty}
              onChange={(e) => handleInputChange(e, "courseCode")}
            >
              {courses.map((course) => (
                <option key={course.code} value={course.code}>
                  {course.code}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="section-instructor">
              Öğretim Görevlisi
            </FormLabel>
            <Select
              id="instructor-select"
              variant="filled"
              placeholder="Öğretim Görevlisi"
              disabled={!selectedFaculty}
              onChange={(e) => handleInputChange(e, "instructorNo")}
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
          {Array.from(sectionData["section-sessions"], (session, index) => (
            <Stack key={index} spacing={4}>
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
                      onClick={() =>
                        deleteSession(sectionData["section-sessions"][index].id)
                      }
                      className="select-all-button"
                      type="button"
                    >
                      -
                    </button>
                  </Stack>
                </FormLabel>
                <FormLabel htmlFor="section-day">Gün</FormLabel>
                <Select
                  id="section-day"
                  variant="filled"
                  placeholder="Gün"
                  name="day"
                  onChange={(e) => handleSessionChange(e, index)}
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
                  borderWidth="2px"
                  name="hour-from"
                  onChange={(e) => handleSessionChange(e, index)}
                />
                -
                <Input
                  id="section-from-time"
                  type="time"
                  colorScheme="teal"
                  borderWidth="2px"
                  name="hour-to"
                  onChange={(e) => handleSessionChange(e, index)}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel htmlFor="section-roomNo">Sınıf</FormLabel>
                <Select
                  id="course-code-select"
                  variant="filled"
                  placeholder="Ders Kodu"
                  disabled={!selectedFaculty}
                  name="roomNo"
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
          <FormControl mb={4}>
            <FormLabel htmlFor="section-capacity">Kapasite</FormLabel>
            <Input
              id="section-capacity"
              type="text"
              colorScheme="teal"
              borderWidth="2px"
              placeholder={recommendedCapacity}
              onChange={(e) => handleInputChange(e, "capacity")}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="section-noStudents">
              Mevcut Öğrenci Sayısı
            </FormLabel>
            <Input
              id="section-noStudents"
              type="text"
              colorScheme="teal"
              borderWidth="2px"
              onChange={(e) => handleInputChange(e, "noStudents")}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="solid"
            colorScheme="teal"
            onClick={handleAddClick}
            mr={3}
          >
            Ekle
          </Button>
          {onClose && (
            <Button variant="solid" onClick={onClose}>
              İptal
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default SectionForm;
