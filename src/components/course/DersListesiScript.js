function noResponse() {
  const table = document.querySelector(".container");
  const noResponseMessage = document.querySelector(".noResponse");
  const overlay = document.getElementById("overlay");

  overlay.classList.add("active");
  noResponseMessage.classList.add("active");
  table.style.display = "none";
}

export function checkTableData() {
  const table = document.querySelector(".container");
  const noDataMessage = document.querySelector(".noData");
  if (table.rows.length === 1) {
    noDataMessage.style.display = "block";
    table.style.display = "none";
  } else {
    noDataMessage.style.display = "none";
    table.style.display = "table";
  }
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

function clearInputFields() {
  const inputs = document.querySelectorAll(".input");

  inputs.forEach((element) => {
    element.value = "";
  });
}

function deleteRowById(id) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (row) {
    row.parentNode.removeChild(row);
  }
}

export async function deleteClass(classRow) {
  const container = document.querySelector(".container");
  for (let i = 0; i < classRow.length; i++) {
    fetch(`http://localhost:3000/course/${classRow[i]}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        checkTableData();
      });
  }
  for (let i = 0; i < classRow.length; i++) {
    deleteRowById(classRow[i]);
  }
}

function updateTableContents(code, faculty, time, place, instructor) {
  return fetch("http://localhost:3000/course", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: code,
      faculty: faculty,
      time: time,
      place: place,
      instructor: instructor,
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
      }
      return -1;
    })
    .catch((error) => {
      checkTableData();
      return false;
    });
}

export function loadTableContents() {
  var size;
  var course;
  const container = document.querySelector(".container");
  fetch("http://localhost:3000/courses")
    .then((response) => response.json())
    .then((data) => {
      size = data.data.length;
      if (size > 0) {
        for (let i = 0; i < size; i++) {
          course = data.data[i];
          createNewRow(
            container,
            course.id,
            course.code,
            course.faculty,
            course.time,
            course.place,
            course.instructor
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

export function submit() {
  let id;
  let kod = document.getElementById("kod").value;
  let fakulte = document.getElementById("fakulte").value;
  let zaman = document.getElementById("zaman").value;
  let sinif = document.getElementById("sinif").value;
  let ogretici = document.getElementById("ogretici").value;
  const modal = document.getElementById("modal");
  const overlay = document.getElementById("overlay");
  const container = document.querySelector(".container");

  updateTableContents(kod, fakulte, zaman, sinif, ogretici).then((result) => {
    if (result === -1) {
      return;
    } else {
      id = result;
    }
    createNewRow(container, id, kod, fakulte, zaman, sinif, ogretici);
    clearInputFields();
    modalDisappear(modal, overlay);
    checkTableData();
  });
}

function createNewRow(container, id, code, faculty, time, place, instructor) {
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
