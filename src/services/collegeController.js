// routes/collegeRoutes.js
const express = require('express');
const collegeService = require('./collegeService');

// Endpoint to add a major
exports.addMajor = async (req, res) => {
    try {
        const { name, graduationRequirements } = req.body;
        const token = req.headers.authorization.split(' ')[1]; // Extract the token from the Authorization header
        const major = await collegeService.addMajor(name, graduationRequirements, token);
        res.status(201).json(major);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getMajors = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Extract the token from the Authorization header
        const majors = await collegeService.getMajors(token);
        res.status(200).json(majors);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateMajor = async (req, res) => {
    try {
        const { name } = req.params;
        const { newName, graduationRequirements } = req.body;
        const token = req.headers.authorization.split(' ')[1]; // Extract the token from the Authorization header
        const major = await collegeService.updateMajor(name, newName, graduationRequirements, token);
        console.log("here");
        console.log(major);
        res.status(200).json(major);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


exports.deleteMajor = async (req, res) => {
    try {
        const { id } = req.params;
        const token = req.headers.authorization.split(' ')[1]; // Extract the token from the Authorization header
        const major = await collegeService.deleteMajor(id, token);
        res.status(200).json(major);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


exports.addCourse = async (req, res) => {
    try {
        const { name, majorId } = req.body;
        const token = req.headers.authorization.split(' ')[1]; // Extract the token from the Authorization header
        const course = await collegeService.addCourse(name, majorId, token);
        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ error: error.message });

    }
}

exports.deleteCourse = async (req, res) => {
    try {
        const { name } = req.params;
        const token = req.headers.authorization.split(' ')[1]; // Extract the token from the Authorization header
        const course = await collegeService.deleteCourse(name, token);
        res.status(200).json(course);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.deleteCoursesForMajor = async (req, res) => {
    try {
        const { majorId } = req.params;
        const token = req.headers.authorization.split(' ')[1]; // Extract the token from the Authorization header
        const courses = await collegeService.deleteCoursesForMajor(majorId, token);
        res.status(200).json(courses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
// Get all students
exports.getStudents = async (req, res) => {
    try {
        const students = await collegeService.getStudents();
        res.status(200).json(students);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get courses for a major
exports.getCoursesForMajor = async (req, res) => {
    try {
        const majorId = req.params.majorId;
        const courses = await collegeService.getCoursesForMajor(majorId);
        res.status(200).json(courses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update student major
exports.updateStudentMajor = async (req, res) => {
    try {
        const { studentId, majorId, name } = req.body;
        await collegeService.updateStudentMajor(studentId, majorId, name);
        res.status(200).send('Major updated successfully');
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//get student courses
exports.getStudentCourses = async (req, res) => {
    try {
        const { studentId } = req.params;
        const courses = await collegeService.getStudentCourses(studentId);
        res.status(200).json(courses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

// Save student grades
exports.saveStudentGrades = async (req, res) => {
    try {
        const { studentId } = req.params;
        const grades = req.body; // Expecting an array of courses with grades
        await collegeService.saveStudentGrades(studentId, grades);
        res.status(200).send('Grades saved successfully');
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
// Similarly, implement get and update methods for students and courses if not already present

// get student majors for a particular student
exports.getStudentMajors = async (req, res) => {
    try {
        const { studentId } = req.params;
        const majors = await collegeService.getStudentMajors(studentId);
        res.status(200).json(majors);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
