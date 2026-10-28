# Student Management System — Viva Questions & Answers

## 1. What is the Student Management System?
It is a web application used to organize student profiles, academic marks, and daily attendance in one interface.

## 2. Which technologies did you use?
HTML5 defines the page structure, CSS3 handles the layout and responsive styling, and vanilla JavaScript implements the application logic and DOM updates.

## 3. Why did you use vanilla JavaScript?
It avoids framework dependencies and demonstrates core JavaScript concepts such as arrays, objects, functions, event listeners, validation, and DOM manipulation.

## 4. What does CRUD mean?
CRUD stands for Create, Read, Update, and Delete. This project uses these operations to manage student records.

## 5. What is localStorage?
`localStorage` is browser storage that saves string key/value pairs and persists after a page refresh. This project converts objects to JSON strings before saving and parses them when loading.

## 6. What is the difference between localStorage and sessionStorage?
`localStorage` generally persists until it is cleared, while `sessionStorage` is scoped to a browser tab session and is cleared when that session ends.

## 7. Does this project need a backend?
No. The application runs entirely in the browser. A backend and database would be needed for shared accounts, centralized records, access control, and synchronization across devices.

## 8. How are marks and percentage calculated?
The application adds the entered subject marks and calculates the average of the entered subjects. If all three subjects have marks, percentage is `total / 300 * 100`, equivalent to the average mark out of 100.

## 9. How is the grade calculated?
The percentage maps to grades A (80+), B (70+), C (60+), D (40+), and F (below 40). The grade is a derived value, so it updates after marks are saved.

## 10. How is attendance percentage calculated?
Attendance percentage is `(Present + Late) / (all marked attendance entries) * 100`. Dates with no status for a student are not included in that student's denominator.

## 11. What is event delegation?
Event delegation attaches one listener to a parent element and handles events from child elements by checking the event target. This project uses it for edit/delete buttons, mark-save buttons, and attendance controls in dynamically rendered tables.

## 12. Why is `JSON.stringify()` used?
`localStorage` stores strings, so `JSON.stringify()` converts arrays and objects into JSON text that can be saved.

## 13. Why is `JSON.parse()` used?
It converts stored JSON text back into JavaScript values such as arrays and objects.

## 14. How do you prevent duplicate student IDs?
Before saving, the code compares the entered ID with existing records. If another record already uses that ID, it shows a validation message and does not save the record.

## 15. How do you validate marks?
Each marks field is numeric and limited to 0–100 in the interface. JavaScript also checks the value before saving, since client-side input attributes alone are not sufficient validation.

## 16. What is responsive web design?
Responsive design adapts a layout to different screen sizes using flexible layouts and CSS media queries. This project changes the sidebar and grid layout on smaller screens.

## 17. What is the DOM?
The Document Object Model represents the HTML document as objects. JavaScript uses the DOM to read inputs, render rows, update summary cards, and respond to user actions.

## 18. What are the advantages of this project?
It reduces manual record keeping, makes records searchable, calculates grades and attendance automatically, and can export data for backup or further analysis.

## 19. What are its limitations?
It has no login or authorization, data stays in one browser, and browser storage can be cleared. It is intended for learning and demonstration rather than real institutional use.

## 20. What future improvements could be added?
A database and backend API, secure login, role-based access, import functionality, printable report cards, more subjects, pagination, audit logs, and automated backups.

## 21. How is CSV export implemented?
The code creates a header row and data rows, escapes embedded quotation marks, joins the values into CSV text, then creates a Blob and a temporary download link.

## 22. What is input sanitization and why is it important?
Input should be validated and safely handled before display or storage. This project HTML-escapes text before inserting student values into HTML templates to reduce the risk of markup injection. Production systems also need server-side validation.

## 23. How do you test the application?
Test adding, editing, and deleting students; duplicate IDs/emails; marks boundaries (0 and 100); grade thresholds; attendance changes across dates; search/filter combinations; exports; browser refresh persistence; and small-screen layout.

## 24. Why is a database better for a real school?
A database with a backend can support centralized records, multiple users, backups, access controls, audit trails, and reliable concurrent updates. Browser storage cannot safely provide those features by itself.
