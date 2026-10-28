/* CampusDesk Student Management System
   Front-end only demo. Data persists in this browser using localStorage. */
(() => {
  "use strict";
  const STORAGE_KEY = "campusDesk.students.v1";
  const ATTENDANCE_KEY = "campusDesk.attendance.v1";
  const SUBJECTS = ["mathematics", "science", "english"];
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  let students = [];
  let attendance = {};
  let toastTimer;

  const dateKey = (date = new Date()) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  };
  const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const initials = (name = "") => name.trim().split(/\s+/).slice(0,2).map(part => part[0] || "").join("").toUpperCase() || "?";
  const formatDate = (date) => new Date(`${date}T12:00:00`).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"});
  const byId = (id) => students.find(student => student.id === id);
  const scoreData = (student) => {
    const values = SUBJECTS.map(subject => student.marks?.[subject]).filter(value => Number.isFinite(value));
    if (!values.length) return {count:0,total:0,percentage:null,grade:"—",status:"Needs marks"};
    const total = values.reduce((sum,value)=>sum+value,0);
    const percentage = total / values.length;
    const grade = percentage >= 80 ? "A" : percentage >= 70 ? "B" : percentage >= 60 ? "C" : percentage >= 40 ? "D" : "F";
    return {count:values.length,total,percentage,grade,status:percentage >= 40 ? "Pass" : "Fail"};
  };
  const attendanceEntries = (student) => Object.values(attendance).map(day => day[student.id]).filter(Boolean);
  const attendanceRate = (student) => {
    const entries = attendanceEntries(student);
    if (!entries.length) return null;
    const attended = entries.filter(status => status === "Present" || status === "Late").length;
    return attended / entries.length * 100;
  };

  function loadData() {
    let hasSavedStudents = false;
    try {
      const rawStudents = localStorage.getItem(STORAGE_KEY);
      const storedStudents = rawStudents === null ? null : JSON.parse(rawStudents);
      const storedAttendance = JSON.parse(localStorage.getItem(ATTENDANCE_KEY));
      hasSavedStudents = Array.isArray(storedStudents);
      if (hasSavedStudents) students = storedStudents;
      if (storedAttendance && typeof storedAttendance === "object") attendance = storedAttendance;
    } catch (error) {
      console.warn("Saved data could not be read; starting with empty records.", error);
      students = []; attendance = {}; hasSavedStudents = false;
    }
    // Seed demo records only on a genuinely fresh install, not when the user has
    // intentionally deleted every student and the saved array is empty.
    if (!hasSavedStudents) {
      students = [
        {id:"STU-1001",name:"Aanya Sharma",email:"aanya.sharma@example.com",phone:"+91 98765 43210",className:"Grade 10-A",dob:"2009-04-14",gender:"Female",marks:{mathematics:92,science:88,english:85},createdAt:Date.now()-500000},
        {id:"STU-1002",name:"Rohan Verma",email:"rohan.verma@example.com",phone:"+91 98765 43211",className:"Grade 10-A",dob:"2009-08-02",gender:"Male",marks:{mathematics:72,science:68,english:79},createdAt:Date.now()-400000},
        {id:"STU-1003",name:"Meera Patel",email:"meera.patel@example.com",phone:"+91 98765 43212",className:"Grade 9-B",dob:"2010-01-21",gender:"Female",marks:{mathematics:55,science:63,english:58},createdAt:Date.now()-300000},
        {id:"STU-1004",name:"Arjun Singh",email:"arjun.singh@example.com",phone:"+91 98765 43213",className:"Grade 9-B",dob:"2010-11-07",gender:"Male",marks:{mathematics:null,science:null,english:null},createdAt:Date.now()-200000},
        {id:"STU-1005",name:"Sara Khan",email:"sara.khan@example.com",phone:"+91 98765 43214",className:"Grade 11-A",dob:"2008-06-30",gender:"Female",marks:{mathematics:86,science:91,english:89},createdAt:Date.now()-100000}
      ];
      const today = dateKey();
      attendance[today] = attendance[today] || {};
      if (!Object.keys(attendance[today]).length) {
        attendance[today] = {"STU-1001":"Present","STU-1002":"Present","STU-1003":"Late","STU-1004":"Absent","STU-1005":"Present"};
      }
      saveData();
    }
  }
  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
      localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(attendance));
    } catch (error) {
      showToast("Could not save data. Check browser storage settings.");
      console.error(error);
    }
  }
  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  }
  function studentCell(student) {
    return `<div class="student-cell"><div class="student-avatar">${escapeHtml(initials(student.name))}</div><div><div class="student-name">${escapeHtml(student.name)}</div><div class="student-email">${escapeHtml(student.email)}</div></div></div>`;
  }
  function statusBadge(status) {
    const cls = status === "Pass" ? "status-pass" : status === "Fail" ? "status-fail" : "status-neutral";
    return `<span class="status-pill ${cls}">${escapeHtml(status)}</span>`;
  }
  function setPage(view) {
    const titles = {dashboard:["OVERVIEW","Dashboard"],students:["STUDENT DIRECTORY","Students"],marks:["ACADEMIC RECORDS","Marks & Grades"],attendance:["DAILY REGISTER","Attendance"]};
    $$(".view").forEach(section => section.classList.remove("active-view"));
    $(`#${view}View`).classList.add("active-view");
    $$(".nav-link").forEach(button => button.classList.toggle("active", button.dataset.view === view));
    $("#pageEyebrow").textContent = titles[view][0];
    $("#pageTitle").textContent = titles[view][1];
    $("#sidebar").classList.remove("open");
    renderAll();
  }
  function renderSummary() {
    $("#totalStudents").textContent = students.length;
    const scored = students.map(scoreData).filter(score => score.percentage !== null);
    const average = scored.length ? scored.reduce((sum,score)=>sum+score.percentage,0)/scored.length : 0;
    $("#averageMarks").textContent = average.toFixed(1);
    const today = attendance[dateKey()] || {};
    const present = Object.values(today).filter(status => status === "Present" || status === "Late").length;
    $("#presentToday").textContent = present;
    $("#attendanceSub").textContent = `${Object.keys(today).length} of ${students.length} marked`;
    const rate = students.length ? Math.round(Object.keys(today).length/students.length*100) : 0;
    $("#attendanceRateBadge").textContent = `${rate}% marked`;
    $("#lowAttendance").textContent = students.filter(student => attendanceRate(student) !== null && attendanceRate(student) < 75).length;
    const recent = [...students].sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).slice(0,5);
    $("#recentStudents").innerHTML = recent.map(student => {
      const score = scoreData(student);
      return `<tr><td>${studentCell(student)}</td><td>${escapeHtml(student.id)}</td><td>${escapeHtml(student.className)}</td><td>${score.percentage === null ? "—" : `${score.percentage.toFixed(1)}%`}</td><td>${statusBadge(score.status)}</td></tr>`;
    }).join("");
    $("#recentEmpty").classList.toggle("hidden", students.length > 0);
    $("#recentStudents").closest(".table-wrap").classList.toggle("hidden", students.length === 0);
  }
  function renderClassFilter() {
    const select = $("#classFilter");
    const selected = select.value;
    const classes = [...new Set(students.map(student => student.className).filter(Boolean))].sort();
    select.innerHTML = `<option value="">All classes</option>${classes.map(name=>`<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("")}`;
    if (classes.includes(selected)) select.value = selected;
  }
  function renderStudents() {
    const search = $("#studentSearch").value.trim().toLowerCase();
    const className = $("#classFilter").value;
    const status = $("#statusFilter").value;
    const filtered = students.filter(student => {
      const score = scoreData(student);
      const matchesSearch = [student.name,student.id,student.email].some(value => String(value||"").toLowerCase().includes(search));
      return matchesSearch && (!className || student.className === className) && (!status || score.status === status);
    }).sort((a,b)=>a.name.localeCompare(b.name));
    $("#studentsTable").innerHTML = filtered.map(student => {
      const score = scoreData(student);
      return `<tr><td>${studentCell(student)}</td><td>${escapeHtml(student.id)}</td><td>${escapeHtml(student.className)}</td><td>${escapeHtml(student.email)}</td><td>${score.percentage === null ? "—" : `${score.percentage.toFixed(1)}%`}</td><td><div class="table-actions"><button class="action-btn" data-edit="${escapeHtml(student.id)}" aria-label="Edit ${escapeHtml(student.name)}">✎ Edit</button><button class="action-btn" data-delete="${escapeHtml(student.id)}" aria-label="Delete ${escapeHtml(student.name)}">×</button></div></td></tr>`;
    }).join("");
    $("#studentCountLabel").textContent = `${filtered.length} of ${students.length} student${students.length === 1 ? "" : "s"}`;
    $("#studentsEmpty").classList.toggle("hidden", filtered.length > 0);
    $("#studentsTable").closest(".table-wrap").classList.toggle("hidden", filtered.length === 0);
  }
  function renderMarks() {
    const search = $("#marksSearch").value.trim().toLowerCase();
    const filtered = students.filter(student => `${student.name} ${student.id} ${student.className}`.toLowerCase().includes(search)).sort((a,b)=>a.name.localeCompare(b.name));
    $("#marksTable").innerHTML = filtered.map(student => {
      const score = scoreData(student);
      const markInput = subject => `<input aria-label="${escapeHtml(subject)} marks for ${escapeHtml(student.name)}" class="mark-input" type="number" min="0" max="100" step="1" data-mark-student="${escapeHtml(student.id)}" data-subject="${subject}" value="${student.marks?.[subject] ?? ""}" placeholder="—">`;
      return `<tr><td>${studentCell(student)}</td><td>${escapeHtml(student.className)}</td><td>${markInput("mathematics")}</td><td>${markInput("science")}</td><td>${markInput("english")}</td><td>${score.count ? `${score.total} / ${score.count*100}` : "—"}</td><td>${score.percentage === null ? "—" : `${score.percentage.toFixed(1)}%`}</td><td><span class="grade-pill">${score.grade}</span></td><td><button class="action-btn" data-save-marks="${escapeHtml(student.id)}">Save</button></td></tr>`;
    }).join("");
    $("#marksEmpty").classList.toggle("hidden", filtered.length > 0);
    $("#marksTable").closest(".table-wrap").classList.toggle("hidden", filtered.length === 0);
  }
  function renderAttendance() {
    const selectedDate = $("#attendanceDate").value || dateKey();
    $("#attendanceDateText").textContent = `Attendance for ${formatDate(selectedDate)}`;
    const day = attendance[selectedDate] || {};
    let present=0, absent=0, late=0, unmarked=0;
    students.forEach(student => {
      const status = day[student.id] || "";
      if(status==="Present") present++; else if(status==="Absent") absent++; else if(status==="Late") late++; else unmarked++;
    });
    $("#attPresent").textContent=present; $("#attAbsent").textContent=absent; $("#attLate").textContent=late; $("#attUnmarked").textContent=unmarked;
    $("#attendanceTable").innerHTML = [...students].sort((a,b)=>a.name.localeCompare(b.name)).map(student => {
      const status = day[student.id] || "";
      const rate = attendanceRate(student);
      const cls = status.toLowerCase();
      return `<tr><td>${studentCell(student)}</td><td>${escapeHtml(student.id)}</td><td>${escapeHtml(student.className)}</td><td><select class="attendance-select ${cls}" data-attendance-student="${escapeHtml(student.id)}" aria-label="Attendance for ${escapeHtml(student.name)}"><option value="" ${!status?"selected":""}>Not marked</option><option value="Present" ${status==="Present"?"selected":""}>Present</option><option value="Absent" ${status==="Absent"?"selected":""}>Absent</option><option value="Late" ${status==="Late"?"selected":""}>Late</option></select></td><td>${rate === null ? '<span class="rate-text">No records</span>' : `<div class="rate-cell ${rate<75?"rate-low":""}"><span class="rate-track"><span class="rate-fill" style="display:block;width:${rate}%"></span></span><span class="rate-text">${rate.toFixed(0)}%</span></div>`}</td></tr>`;
    }).join("");
    $("#attendanceEmpty").classList.toggle("hidden", students.length > 0);
    $("#attendanceTable").closest(".table-wrap").classList.toggle("hidden", students.length === 0);
  }
  function renderAll() {
    renderSummary(); renderClassFilter(); renderStudents(); renderMarks(); renderAttendance();
  }
  function openModal(student = null) {
    $("#studentForm").reset();
    $("#formError").classList.add("hidden");
    $("#editStudentId").value = student ? student.id : "";
    $("#modalTitle").textContent = student ? "Edit student" : "Add student";
    $("#studentId").disabled = Boolean(student);
    if (student) {
      $("#studentName").value = student.name;
      $("#studentId").value = student.id;
      $("#studentEmail").value = student.email;
      $("#studentPhone").value = student.phone || "";
      $("#studentClass").value = student.className;
      $("#studentDob").value = student.dob || "";
      $("#studentGender").value = student.gender || "";
    } else {
      $("#studentId").disabled = false;
    }
    $("#studentModal").classList.remove("hidden");
    setTimeout(() => $("#studentName").focus(), 30);
  }
  function closeModal() { $("#studentModal").classList.add("hidden"); }
  function saveStudent(event) {
    event.preventDefault();
    const editingId = $("#editStudentId").value;
    const id = $("#studentId").value.trim().toUpperCase();
    const student = {
      id, name:$("#studentName").value.trim(), email:$("#studentEmail").value.trim(),
      phone:$("#studentPhone").value.trim(), className:$("#studentClass").value.trim(),
      dob:$("#studentDob").value, gender:$("#studentGender").value,
      marks: editingId ? (byId(editingId)?.marks || {}) : {mathematics:null,science:null,english:null},
      createdAt: editingId ? (byId(editingId)?.createdAt || Date.now()) : Date.now()
    };
    const error = $("#formError");
    if (!student.name || !student.email || !student.className || !id) {
      error.textContent = "Please complete all required fields."; error.classList.remove("hidden"); return;
    }
    const duplicate = students.some(existing => existing.id.toLowerCase() === id.toLowerCase() && existing.id !== editingId);
    if (duplicate) { error.textContent = "That student ID already exists. Please use a unique ID."; error.classList.remove("hidden"); return; }
    const duplicateEmail = students.some(existing => existing.email.toLowerCase() === student.email.toLowerCase() && existing.id !== editingId);
    if (duplicateEmail) { error.textContent = "That email address is already assigned to another student."; error.classList.remove("hidden"); return; }
    if (editingId) {
      students = students.map(existing => existing.id === editingId ? student : existing);
      showToast("Student record updated.");
    } else {
      students.push(student);
      showToast("Student added successfully.");
    }
    saveData(); closeModal(); renderAll();
  }
  function deleteStudent(id) {
    const student = byId(id);
    if (!student) return;
    if (!confirm(`Delete ${student.name} (${student.id})? This also removes their attendance records. This cannot be undone.`)) return;
    students = students.filter(item => item.id !== id);
    Object.keys(attendance).forEach(date => { delete attendance[date][id]; });
    saveData(); renderAll(); showToast("Student record deleted.");
  }
  function saveMarks(id) {
    const student = byId(id); if (!student) return;
    const inputs = $$(`[data-mark-student="${CSS.escape(id)}"]`);
    const marks = {...(student.marks || {})};
    for (const input of inputs) {
      const raw = input.value.trim();
      if (raw === "") { marks[input.dataset.subject] = null; continue; }
      const value = Number(raw);
      if (!Number.isFinite(value) || value < 0 || value > 100) {
        input.focus(); showToast("Marks must be between 0 and 100."); return;
      }
      marks[input.dataset.subject] = value;
    }
    student.marks = marks; saveData(); renderAll(); showToast("Marks saved.");
  }
  function setAttendance(id, status) {
    const date = $("#attendanceDate").value || dateKey();
    attendance[date] = attendance[date] || {};
    if (status) attendance[date][id] = status; else delete attendance[date][id];
    saveData(); renderAttendance(); renderSummary(); showToast("Attendance updated.");
  }
  function downloadFile(filename, content, type) {
    const blob = new Blob([content], {type});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = filename; document.body.appendChild(anchor); anchor.click(); anchor.remove();
    URL.revokeObjectURL(url);
  }
  function exportJson() {
    downloadFile(`students-${dateKey()}.json`, JSON.stringify({students,attendance,exportedAt:new Date().toISOString()},null,2), "application/json");
    showToast("JSON export downloaded.");
  }
  function exportCsv() {
    const headers = ["Student ID","Name","Email","Phone","Class","Date of Birth","Gender","Mathematics","Science","English","Total Marks","Percentage","Grade","Attendance Rate"];
    const rows = students.map(student => {
      const score = scoreData(student); const rate = attendanceRate(student);
      return [student.id,student.name,student.email,student.phone,student.className,student.dob,student.gender,
        ...SUBJECTS.map(subject=>student.marks?.[subject] ?? ""),score.count?score.total:"",score.percentage===null?"":score.percentage.toFixed(2),score.grade,rate===null?"":rate.toFixed(2)];
    });
    const csvCell = value => `"${String(value ?? "").replace(/"/g,'""')}"`;
    downloadFile(`students-${dateKey()}.csv`,[headers,...rows].map(row=>row.map(csvCell).join(",")).join("\r\n"),"text/csv;charset=utf-8;");
    showToast("CSV export downloaded.");
  }
  function bindEvents() {
    $$(".nav-link").forEach(button => button.addEventListener("click", () => setPage(button.dataset.view)));
    $$("[data-go]").forEach(button => button.addEventListener("click", () => setPage(button.dataset.go)));
    $("#menuToggle").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
    ["addStudentTop","addStudentPage","emptyAdd","quickAdd","attendanceAdd"].forEach(id => $("#"+id).addEventListener("click", () => openModal()));
    $("#closeModal").addEventListener("click",closeModal);
    $("#cancelModal").addEventListener("click",closeModal);
    $("#studentModal").addEventListener("click",event=>{if(event.target===$("#studentModal"))closeModal();});
    document.addEventListener("keydown",event=>{if(event.key==="Escape")closeModal();});
    $("#studentForm").addEventListener("submit",saveStudent);
    ["studentSearch","classFilter","statusFilter"].forEach(id=>$("#"+id).addEventListener(id==="studentSearch"?"input":"change",renderStudents));
    $("#marksSearch").addEventListener("input",renderMarks);
    $("#studentsTable").addEventListener("click",event=>{
      const edit=event.target.closest("[data-edit]"); const del=event.target.closest("[data-delete]");
      if(edit)openModal(byId(edit.dataset.edit)); if(del)deleteStudent(del.dataset.delete);
    });
    $("#marksTable").addEventListener("click",event=>{const button=event.target.closest("[data-save-marks]");if(button)saveMarks(button.dataset.saveMarks);});
    $("#marksTable").addEventListener("keydown",event=>{if(event.key==="Enter"&&event.target.matches(".mark-input")){event.preventDefault();const id=event.target.dataset.markStudent;saveMarks(id);}});
    $("#attendanceTable").addEventListener("change",event=>{const select=event.target.closest("[data-attendance-student]");if(select)setAttendance(select.dataset.attendanceStudent,select.value);});
    $("#attendanceDate").addEventListener("change",renderAttendance);
    $("#markAllPresent").addEventListener("click",()=>{
      const date=$("#attendanceDate").value||dateKey();
      if(!students.length){showToast("Add students before taking attendance.");return;}
      attendance[date]=attendance[date]||{};
      students.forEach(student=>attendance[date][student.id]="Present");
      saveData();renderAttendance();renderSummary();showToast("All students marked present.");
    });
    ["exportJson","exportDashboard"].forEach(id=>$("#"+id).addEventListener("click",exportJson));
    ["exportCsv"].forEach(id=>$("#"+id).addEventListener("click",exportCsv));
    $("#marksExport").addEventListener("click",exportCsv);
  }
  function init() {
    loadData();
    $("#todayLabel").textContent = new Date().toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"});
    $("#attendanceDate").value = dateKey();
    // Keep generated demo data available on first run; after the user deletes all records,
    // the empty state stays empty rather than reseeding the demo.
    bindEvents(); renderAll();
  }
  init();
})();