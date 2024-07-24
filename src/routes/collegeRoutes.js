const express = require('express');
const {
    addMajor,
    getMajors,
    updateMajor,
    deleteMajor,
    getStudents,
    getCoursesForMajor,
    updateStudentMajor,
    saveStudentGrades,
    addCourse,
    deleteCourse,
    deleteCoursesForMajor,
    getStudentCourses,
    getStudentMajors
} = require('../services/collegeController');

const router = express.Router();

// Route to add a major
router.post('/majors', addMajor);

// Route to get all majors
router.get('/majors', getMajors);

// Route to update a major
router.put('/majors/:name', updateMajor);

// Route to delete a major
router.delete('/majors/:id', deleteMajor);

// Route to add a course
router.post('/courses', addCourse);

// Route to delete a course
router.delete('/courses/:name', deleteCourse);

// Route to delete all courses that have a particular majorId
router.delete('/courses/majors/:majorId', deleteCoursesForMajor);


// Route to get all students
router.get('/students', getStudents);

// Route to get courses for a major
router.get('/majors/:majorId/courses', getCoursesForMajor);

// Route to update student major
router.put('/student_majors', updateStudentMajor);

// Route to save student grades 
router.put('/student_courses/:studentId', saveStudentGrades);

router.get('/student_courses/:studentId', getStudentCourses);

module.exports = router;

// route to get student majors
router.get('/student_majors/:studentId', getStudentMajors);
