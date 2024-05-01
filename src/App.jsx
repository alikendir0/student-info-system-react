import "./App.css";
import "./index.css";
import Course from "./components/course/Course.jsx";
import Student from "./components/student/Student.jsx";
import Login from "./components/login/Login.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
        <Routes>
          <Route path="/student" element={<Student />} />
        </Routes>
        <Routes>
          <Route path="/course" element={<Course />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
