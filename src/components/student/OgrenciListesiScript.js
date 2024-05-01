function noResponse() {
  const table = document.querySelector(".container");
  const noResponseMessage = document.querySelector(".noResponse");
  const overlay = document.getElementById("overlay");
  const tbutton = document.getElementById("open");
  const dbutton = document.getElementById("delete");
  const abutton = document.getElementById("a-open");
  const rbutton = document.getElementById("reset");

  overlay.classList.add("active");
  noResponseMessage.classList.add("active");
  table.style.display = "none";
  tbutton.classList.add("disabled");
  dbutton.classList.add("disabled");
  abutton.classList.add("disabled");
  rbutton.classList.add("disabled");
}

export async function checkTableData() {
  var classSize;
  try {
    const response = await fetch("http://localhost:3000/courses");
    const data = await response.json();
    classSize = data.size;
  } catch (err) {
    console.log(err);
  }

  const table = document.querySelector(".container");
  const noDataMessage = document.querySelector(".noData");
  const dbutton = document.getElementById("delete");
  const abutton = document.getElementById("a-open");
  const rbutton = document.getElementById("reset");

  if (table.rows.length === 1) {
    noDataMessage.style.display = "block";
    table.style.display = "none";
    dbutton.classList.add("disabled");
    abutton.classList.add("disabled");
    rbutton.classList.add("disabled");
  } else if (classSize === 0) {
    noDataMessage.style.display = "none";
    table.style.display = "table";
    dbutton.classList.remove("disabled");
    abutton.classList.add("disabled");
    rbutton.classList.remove("disabled");
  } else {
    noDataMessage.style.display = "none";
    table.style.display = "table";
    dbutton.classList.remove("disabled");
    abutton.classList.remove("disabled");
    rbutton.classList.remove("disabled");
  }
}

export function submit() {
  var ad = document.getElementById("ad").value;
  var soyad = document.getElementById("soyad").value;
  var tcNo = document.getElementById("tcNo").value;
  var ogrenciNo = document.getElementById("ogrenciNo").value;
  const container = document.querySelector(".container");
  const modal = document.getElementById("modal");
  const overlay = document.getElementById("overlay");
  var id = -1;

  updateTableContents(ad, soyad, tcNo, ogrenciNo).then((result) => {
    if (result === -1) {
      return;
    } else {
      id = result;
    }
    createNewRow(container, id, ad, soyad, tcNo, ogrenciNo);
    clearInputFields();
    modalDisappear(modal, overlay);
    checkTableData();
  });
}

function deleteRowById(id) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (row) {
    row.parentNode.removeChild(row);
  }
}

export async function deleteStudent(studentRow) {
  for (let i = 0; i < studentRow.length; i++) {
    fetch(`http://localhost:3000/student/${studentRow[i]}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        checkTableData();
      });
  }
  for (let i = 0; i < studentRow.length; i++) {
    deleteRowById(studentRow[i]);
  }
  killButtonDetector();
  buttonDetector();
}

export function getIds() {
  const checkboxes = document.querySelectorAll(".container .Checkbox");
  const checkedIds = [];

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const row = checkbox.closest("tr");
      const id = row.getAttribute("data-id");
      checkedIds.push(id);
    }
  });
  return checkedIds;
}

function getCourseIds() {
  const checkboxes = document.querySelectorAll(".a-container .Checkbox");
  const checkedIds = [];

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const row = checkbox.closest("tr");
      const id = row.getAttribute("data-id");
      checkedIds.push(id);
    }
  });
  return checkedIds;
}

function updateTableContents(name, lastName, idNo, studentNo) {
  return fetch("http://localhost:3000/student", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      lastName: lastName,
      idNo: idNo,
      studentNo: studentNo,
      dersler: [],
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const id = data.data.id;
      var element = document.querySelector(".hatali");
      if (!data.data instanceof Array) {
        return id;
      } else {
        element.innerText = data.data[0].message;
        hataliAppear();
        return -1;
      }
    })
    .catch((error) => {
      checkTableData();
      return false;
    });
}

export function loadTableContents() {
  var size;
  var ogrenci;
  const container = document.querySelector(".container");
  while (container.rows.length > 1) {
    container.deleteRow(container.rows.length - 1);
  }
  fetch("http://localhost:3000/students")
    .then((response) => response.json())
    .then((data) => {
      size = data.data.length;
      if (size > 0) {
        for (let i = 0; i < size; i++) {
          ogrenci = data.data[i];
          createNewRow(
            container,
            ogrenci.id,
            ogrenci.name,
            ogrenci.lastName,
            ogrenci.idNo,
            ogrenci.studentNo
          );
        }
        checkTableData();
      } else checkTableData();
    })
    .catch((error) => {
      console.error("Error:", error);
      noResponse();
    });
}

function modalLoadTableContents() {
  let course;
  let size;
  const container = document.querySelector(".a-container");
  while (container.rows.length > 1) {
    container.deleteRow(container.rows.length - 1);
  }
  fetch("http://localhost:3000/courses")
    .then((response) => response.json())
    .then((data) => {
      size = data.data.length;
      if (size > 0) {
        for (let i = 0; i < size; i++) {
          course = data.data[i];
          modalCreateNewRow(
            container,
            course.id,
            course.code,
            course.faculty,
            course.time,
            course.place,
            course.instructor
          );
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export function modalSubmit() {
  const modal = document.getElementById("a-modal");
  const overlay = document.getElementById("a-overlay");
  const table = document.querySelector(".container");
  const atable = document.querySelector(".a-container");

  const students = getIds();
  for (let i = 0; i < students.length; i++) {
    const courses = getCourseIds();
    fetch(`http://localhost:3000/student/add/course/${students[i]}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courses: courses,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }
  clearCheckBoxes();
  modalDisappear(modal, overlay);
  killButtonDetector();
  buttonDetector();
}

function modalCreateNewRow(
  container,
  id,
  code,
  faculty,
  time,
  place,
  instructor
) {
  const newRow = document.createElement("tr");
  newRow.setAttribute("data-id", id);
  const checkbox = document.createElement("input");
  const boxCell = document.createElement("td");
  const codeCell = document.createElement("td");
  const facultyCell = document.createElement("td");
  const timeCell = document.createElement("td");
  const placeCell = document.createElement("td");
  const instructorCell = document.createElement("td");
  checkbox.className = "Checkbox";
  checkbox.type = "checkbox";
  codeCell.textContent = code;
  facultyCell.textContent = faculty;
  timeCell.textContent = time;
  placeCell.textContent = place;
  instructorCell.textContent = instructor;
  newRow.appendChild(boxCell);
  boxCell.appendChild(checkbox);
  newRow.appendChild(codeCell);
  newRow.appendChild(facultyCell);
  newRow.appendChild(timeCell);
  newRow.appendChild(placeCell);
  newRow.appendChild(instructorCell);

  container.appendChild(newRow);
}

function createNewRow(container, id, ad, soyad, tcNo, ogrenciNo) {
  const newRow = document.createElement("tr");
  newRow.setAttribute("data-id", id);
  const checkbox = document.createElement("input");
  const boxCell = document.createElement("td");
  const adCell = document.createElement("td");
  const soyadCell = document.createElement("td");
  const tcNoCell = document.createElement("td");
  const ogrenciNoCell = document.createElement("td");
  const buttonCell = document.createElement("td");
  const button = document.createElement("BUTTON");
  const buttonText = document.createTextNode("Dersler");
  button.appendChild(buttonText);

  checkbox.className = "Checkbox";
  checkbox.type = "checkbox";
  adCell.textContent = ad;
  soyadCell.textContent = soyad;
  tcNoCell.textContent = tcNo;
  ogrenciNoCell.textContent = ogrenciNo;
  button.className = "ders-button";
  newRow.appendChild(boxCell);
  boxCell.appendChild(checkbox);
  newRow.appendChild(adCell);
  newRow.appendChild(soyadCell);
  newRow.appendChild(tcNoCell);
  newRow.appendChild(ogrenciNoCell);
  newRow.appendChild(buttonCell);
  buttonCell.appendChild(button);

  container.appendChild(newRow);
  killButtonDetector();
  buttonDetector();
}

function modalAppear(modal, overlay) {
  modal.classList.add("active");
  overlay.classList.add("active");
}

function modalDisappear(modal, overlay) {
  modal.classList.remove("active");
  overlay.classList.remove("active");
}

function hataliAppear() {
  const hatali = document.getElementById("hatali");
  hatali.classList.add("active");
}

function hataliDisappear() {
  const hatali = document.getElementById("hatali");
  hatali.classList.remove("active");
}

export function modalButtonProperties() {
  const modal = document.getElementById("modal");
  const overlay = document.getElementById("overlay");
  const openBtn = document.getElementById("open");
  const closeBtn = document.getElementById("close");

  openBtn.addEventListener("click", () => modalAppear(modal, overlay));
  openBtn.addEventListener("click", () => hataliDisappear());
  openBtn.addEventListener("click", () => clearInputFields());
  closeBtn.addEventListener("click", () => modalDisappear(modal, overlay));
  closeBtn.addEventListener("click", () => hataliDisappear());
}

export function assignmentModalButtonProperties() {
  const modal = document.getElementById("a-modal");
  const overlay = document.getElementById("a-overlay");
  const openBtn = document.getElementById("a-open");
  const closeBtn = document.getElementById("a-close");

  openBtn.addEventListener("click", () => modalAppear(modal, overlay));
  openBtn.addEventListener("click", () => hataliDisappear());
  openBtn.addEventListener("click", () => clearInputFields());
  openBtn.addEventListener("click", () => modalLoadTableContents());
  closeBtn.addEventListener("click", () => modalDisappear(modal, overlay));
  closeBtn.addEventListener("click", () => hataliDisappear());
}

export function checkCheckBoxes() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const areAllChecked = Array.from(checkboxes).every(
    (checkbox) => checkbox.checked
  );
  checkboxes.forEach((checkbox) => {
    checkbox.checked = !areAllChecked;
  });
}

function clearCheckBoxes() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
}

function clearInputFields() {
  const inputs = document.querySelectorAll(".input");

  inputs.forEach((element) => {
    element.value = "";
  });
}

export function resetClasses() {
  fetch(`http://localhost:3000/students/delete/courses`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ids: getIds(),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      clearCheckBoxes();
      checkTableData();
    });
}

export function killButtonDetector() {
  const buttons = document.querySelectorAll(".ders-button");

  buttons.forEach((button) => {
    let newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
  });
}

function classes(id) {
  fetch(`http://localhost:3000/student/courses/${id}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.data.length !== 0) alert(data.data);
      else alert("Hiçbir ders atanmadı!");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export function buttonDetector() {
  document.querySelectorAll(".ders-button").forEach((button, index) => {
    button.addEventListener("click", () => {
      const row = button.closest("tr");
      const id = row.getAttribute("data-id");
      classes(id);
    });
  });
}

function getStudentCheckedPositions() {
  const checkboxes = document.querySelectorAll(".container .Checkbox");
  const checkedPositions = [];
  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      checkedPositions.push(index + 1);
    }
  });
  return checkedPositions;
}

function getClassCheckedPositions() {
  const checkboxes = document.querySelectorAll(".a-container .Checkbox");
  const checkedPositions = [];
  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      checkedPositions.push(index + 1);
    }
  });
  return checkedPositions;
}
