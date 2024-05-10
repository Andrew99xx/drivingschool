document.addEventListener('DOMContentLoaded', function() {
    const lessonForm = document.getElementById('lesson-form');
    const lessonList = document.getElementById('lesson-list');

    // Function to fetch student details from local storage
    function fetchStudentDetails(studentName) {
        const students = JSON.parse(localStorage.getItem('students')) || {};
        return students[studentName] || {};
    }

    // Function to update local storage with booked lesson
    function updateLocalStorage(studentName, lessonType, lessonDuration) {
        const students = JSON.parse(localStorage.getItem('students')) || {};
        const studentDetails = students[studentName] || {};
        const timestamp = new Date().getTime();
        const lesson = {
            type: lessonType,
            duration: lessonDuration,
            timestamp: timestamp
        };
        if (!studentDetails.lessons) {
            studentDetails.lessons = [];
        }
        studentDetails.lessons.push(lesson);
        students[studentName] = studentDetails;
        localStorage.setItem('students', JSON.stringify(students));
    }

    // Function to populate lesson list from local storage
    function populateLessonList() {
        lessonList.innerHTML = '';
        const students = JSON.parse(localStorage.getItem('students')) || {};
        for (const studentName in students) {
            if (students.hasOwnProperty(studentName)) {
                const studentDetails = students[studentName];
                if (studentDetails.lessons) {
                    studentDetails.lessons.forEach(lesson => {
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `<strong>${studentName}</strong> - ${lesson.type} (${lesson.duration} hours)`;
                        lessonList.appendChild(listItem);
                    });
                }
            }
        }
    }

    // Event listener for submitting lesson form
    lessonForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const studentName = document.getElementById('student-name').value;
        const lessonType = document.getElementById('lesson-type').value;
        const lessonDuration = document.getElementById('lesson-duration').value;

        // Update local storage with booked lesson
        updateLocalStorage(studentName, lessonType, lessonDuration);

        // Populate lesson list based on local storage
        populateLessonList();

        // Clear form fields
        document.getElementById('student-name').value = '';
        document.getElementById('lesson-type').selectedIndex = 0;
        document.getElementById('lesson-duration').value = '';
    });

    // Populate lesson list on page load
    populateLessonList();
});


document.addEventListener('DOMContentLoaded', function() {
    const studentForm = document.getElementById('student-details-form');

    studentForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const studentName = document.getElementById('student-name').value;
        const studentAge = document.getElementById('student-age').value;
        const studentEmail = document.getElementById('student-email').value;

        // Save student details to local storage
        saveStudentDetails(studentName, { age: studentAge, email: studentEmail });

        // Clear form fields
        document.getElementById('student-name').value = '';
        document.getElementById('student-age').value = '';
        document.getElementById('student-email').value = '';

        alert('Student details saved successfully!');
        window.location.href = 'student-display.html';

    });

    // Function to save student details to local storage
    function saveStudentDetails(studentName, studentDetails) {
        let students = JSON.parse(localStorage.getItem('students')) || {};
        students[studentName] = studentDetails;
        localStorage.setItem('students', JSON.stringify(students));
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const addStudentBtn = document.getElementById('add-student-btn');
    const studentTableBody = document.getElementById('student-table-body');
    const editStudentModal = document.getElementById('edit-student-modal');
    const editStudentForm = document.getElementById('edit-student-form');

    // Show modal to edit student details
    function showEditModal(studentName, studentAge, studentEmail) {
        document.getElementById('edit-student-name').value = studentName;
        document.getElementById('edit-student-age').value = studentAge;
        document.getElementById('edit-student-email').value = studentEmail;
        editStudentModal.style.display = 'block';
    }

    // Close modal
    function closeEditModal() {
        editStudentModal.style.display = 'none';
    }

    // Fetch data from local storage and populate student table
    function populateStudentTable() {
        studentTableBody.innerHTML = '';
        const students = JSON.parse(localStorage.getItem('students')) || {};
        for (const studentName in students) {
            if (students.hasOwnProperty(studentName)) {
                const studentDetails = students[studentName];
                const row = `<tr>
                                <td>${studentName}</td>
                                <td>${studentDetails.age}</td>
                                <td>${studentDetails.email}</td>
                                <td>${studentDetails.score !== undefined ? studentDetails.score : 0}</td>
                                <td>
                                    <button class="edit-btn">Edit</button>
                                    <button class="delete-btn">Delete</button>
                                </td>
                            </tr>`;
                studentTableBody.innerHTML += row;
            }
        }
    }

    // Event listener for Add Student button
    addStudentBtn.addEventListener('click', function() {
        // Your code to open a modal for adding new student goes here
    });

    // Event listener for Edit and Delete buttons (event delegation)
    studentTableBody.addEventListener('click', function(event) {
        const target = event.target;
        if (target.classList.contains('edit-btn')) {
            const row = target.closest('tr');
            const name = row.querySelector('td:first-child').innerText;
            const age = row.querySelector('td:nth-child(2)').innerText;
            const email = row.querySelector('td:nth-child(3)').innerText;
            showEditModal(name, age, email);
        } else if (target.classList.contains('delete-btn')) {
            const row = target.closest('tr');
            const name = row.querySelector('td:first-child').innerText;
            if (confirm(`Are you sure you want to delete ${name}?`)) {
                deleteStudent(name);
            }
        }
    });

    // Event listener for closing modal
    editStudentModal.querySelector('.close').addEventListener('click', closeEditModal);

    // Event listener for submitting edit student form
    editStudentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('edit-student-name').value;
        const age = document.getElementById('edit-student-age').value;
        const email = document.getElementById('edit-student-email').value;
        const score = document.getElementById('edit-student-score').value;
        editStudent(name, { age, email, score });
        closeEditModal();
    });

    // Function to delete student
    function deleteStudent(name) {
        const students = JSON.parse(localStorage.getItem('students')) || {};
        delete students[name];
        localStorage.setItem('students', JSON.stringify(students));
        populateStudentTable();
    }

    // Function to edit student details
    function editStudent(name, details) {
        const students = JSON.parse(localStorage.getItem('students')) || {};
        students[name] = details;
        localStorage.setItem('students', JSON.stringify(students));
        populateStudentTable();
    }

    // Initialize table on page load
    populateStudentTable();
});
;

document.addEventListener('DOMContentLoaded', function() {
    const studentNameDropdown = document.getElementById('student-name');

    // Function to populate student names in the dropdown
    function populateStudentNames() {
        const students = JSON.parse(localStorage.getItem('students')) || {};
        for (const studentName in students) {
            if (students.hasOwnProperty(studentName)) {
                const option = document.createElement('option');
                option.value = studentName;
                option.textContent = studentName;
                studentNameDropdown.appendChild(option);
            }
        }
    }

    // Populate student names on page load
    populateStudentNames();
});

document.addEventListener('DOMContentLoaded', function() {
    const addInstructorForm = document.getElementById('add-instructor-form');
    const instructorList = document.getElementById('instructor-list-items');

    // Function to update local storage with instructor details
    function updateLocalStorage(instructorName, contactDetails) {
        const instructors = JSON.parse(localStorage.getItem('instructors')) || {};
        instructors[instructorName] = contactDetails;
        localStorage.setItem('instructors', JSON.stringify(instructors));
    }

    // Function to populate instructor list from local storage
    function populateInstructorList() {
        instructorList.innerHTML = '';
        const instructors = JSON.parse(localStorage.getItem('instructors')) || {};
        for (const instructorName in instructors) {
            if (instructors.hasOwnProperty(instructorName)) {
                const contactDetails = instructors[instructorName];
                const listItem = document.createElement('li');
                listItem.textContent = `${instructorName} - ${contactDetails}`;
                instructorList.appendChild(listItem);
            }
        }
    }

    // Event listener for submitting add instructor form
    addInstructorForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const instructorName = document.getElementById('instructor-name').value;
        const instructorContact = document.getElementById('instructor-contact').value;

        // Update local storage with instructor details
        updateLocalStorage(instructorName, instructorContact);

        // Populate instructor list based on local storage
        populateInstructorList();

        // Clear form fields
        document.getElementById('instructor-name').value = '';
        document.getElementById('instructor-contact').value = '';
    });

    // Populate instructor list on page load
    populateInstructorList();
});
