# Student Management System — CampusDesk

A responsive front-end Student Management System built with **HTML5, CSS3, and vanilla JavaScript**. It is suitable as an Ausbildung / web development project and runs without a backend.

## Features

- Dashboard summary cards: total students, average marks percentage, present today, and low attendance.
- Student CRUD: create, view, edit, and delete student records.
- Student fields: student ID, name, email, phone, class/section, date of birth, and gender.
- Marks management for Mathematics, Science, and English, with total, percentage, and grade calculation.
- Attendance register by date with Present, Absent, Late, and Not marked statuses.
- Individual attendance-rate calculation. Present and Late count as attended.
- Search students and filter by class and academic status.
- Export student records as CSV or JSON.
- Responsive sidebar/dashboard layout and form validation.
- Sample records for demonstration.
- Browser `localStorage` persistence.

## Project files

```text
student-management-system/
├── index.html
├── style.css
├── script.js
├── README.md
└── VIVA.md
```

## Setup

1. Download and extract the project folder.
2. Open `index.html` in a modern browser, or open the folder in Visual Studio Code and use the Live Server extension.
3. Use **Add student** to create records, **Marks & Grades** to enter marks, and **Attendance** to mark daily attendance.

No npm packages, build process, server, or database are required.

## Grade rules

The percentage is calculated from the marks that have been entered for a student. Empty subjects are not included until marks are entered.

| Percentage | Grade | Result |
|---|---|---|
| 80–100 | A | Pass |
| 70–79.99 | B | Pass |
| 60–69.99 | C | Pass |
| 40–59.99 | D | Pass |
| Below 40 | F | Fail |

For example, marks of 80, 70, and 90 give a total of 240/300 and a percentage of 80%.

## Data and privacy notes

- Records are saved in this browser using `localStorage`; they are not sent to a server.
- Data is specific to the browser profile and device. It will not automatically sync to another device.
- Clearing browser site data can remove the saved records. Export a JSON or CSV backup periodically.
- This is a learning/demo project, not a secure production student-information system. Do not enter real sensitive student information into a public/shared computer.
- The sample data is inserted on the first run only when no student records are stored. After removing all records, reloads remain empty because an empty saved array is treated as an intentional state.

## Technical concepts demonstrated

- Semantic HTML and accessible labels
- CSS Grid, Flexbox, media queries, and responsive tables
- DOM selection and event delegation
- Arrays, objects, `map`, `filter`, `reduce`, and sorting
- Form validation and duplicate ID/email checks
- Date-keyed attendance data
- Derived values for marks, grades, and attendance percentages
- JSON serialization and CSV generation
- Browser storage and downloadable Blob files

## Known limitations / future enhancements

- There is no authentication, role management, backend, or multi-user synchronization.
- Marks are three fixed subjects; you can extend the `SUBJECTS` list and table to add subjects.
- CSV/JSON export is implemented; import, pagination, and printable report cards can be added as future scope.
- Browser-local data is not a substitute for a database or regular backups.
