//collegeService.js
const supabase = require('../utils/supabaseClient');

// Add a new major
exports.addMajor = async (name, graduationRequirements, token) => {
    const { data, error } = await supabase
        .from('majors')
        .insert({ name, graduation_requirements: graduationRequirements })
        .select();

    if (error) {
        console.error('Error adding major:', error.message); // Log error
        throw new Error(error.message);
    }


    console.log("major added");
    const majorId = data[0].id;
    console.log(majorId);

    return data;
};

// Get all majors
exports.getMajors = async (token) => {
    const { data, error } = await supabase
        .from('majors')
        .select('*');

    if (error) {
        console.error('Error fetching majors:', error.message); // Log error
        throw new Error(error.message);
    }
    return data;
};

// Update a major
exports.updateMajor = async (name, newName, graduationRequirements, token) => {

    const { data, error } = await supabase
        .from('majors')
        .update({ name: newName, graduation_requirements: graduationRequirements })
        .eq('name', name)
        .select();

    console.log(data);
    console.log(error);

    if (error) {
        console.error('Error updating major:', error.message);
        throw new Error(error.message);
    }

    return data;
};

// Delete a major
exports.deleteMajor = async (id, token) => {
    const { data, error } = await supabase
        .from('majors')
        .delete()
        .eq('id', id)
        .select();

    if (error) {
        console.error('Error deleting major:', error.message);
        throw new Error(error.message);
    }
    return data;
};

exports.addCourse = async (courseName, majorId, token) => {
    console.log("am I called");
    const { data, error } = await supabase
        .from('courses')
        .insert({ name: courseName, major_id: majorId })
        .select();

    if (error) throw new Error(error.message);
    return data;
};

exports.deleteCourse = async (courseName, token) => {
    const { data, error } = await supabase
        .from('courses')
        .delete()
        .eq('name', courseName)
        .select();

    if (error) throw new Error(error.message);
    return data;
}


exports.deleteCoursesForMajor = async (majorId, token) => {
    const { data: coursesToDelete, error: selectError } = await supabase
        .from('courses')
        .select('*')
        .eq('major_id', majorId);

    if (selectError) throw new Error(selectError.message);

    // Then, delete the courses
    const { error: deleteError } = await supabase
        .from('courses')
        .delete()
        .eq('major_id', majorId);

    if (deleteError) throw new Error(deleteError.message);

    // Return the details of the deleted courses
    return coursesToDelete;
};



exports.getStudents = async () => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'student');

    if (error) throw new Error(error.message);
    return data;
};

// Get courses for a major
exports.getCoursesForMajor = async (majorId) => {
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('major_id', majorId);

    if (error) throw new Error(error.message);
    return data;
};

// write a function to get student_majors for a particular student
exports.getStudentMajors = async (studentId) => {
    const { data, error } = await supabase
        .from('student_majors')
        .select('*')
        .eq('student_id', studentId);
    if (error) throw new Error(error.message);
    return data;
};


// Update student major
// collegeService.js
exports.updateStudentMajor = async (studentId, majorId, name) => {
    //  dont add duplicate majors for students
    const { data: studentMajors, error: studentMajorsError } = await supabase
        .from('student_majors')
        .select('*')
        .eq('student_id', studentId);
    if (studentMajorsError) throw new Error(studentMajorsError.message);

    const studentMajorsArray = studentMajors.map((major) => major.major_id);
    if (studentMajorsArray.map(String).includes(String(majorId))) {
        throw new Error('Student already has this major');
    }
    // Then, update the student major
    const { data: upsertData, error: upsertError } = await supabase
        .from('student_majors')
        .insert({ student_id: studentId, major_id: majorId, name: name });

    if (upsertError) {
        console.error('Error updating student major:', upsertError.message);
        throw new Error(upsertError.message);
    }

    // Fetch courses for the given major
    const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('major_id', majorId);

    if (coursesError) throw new Error(coursesError.message);

    console.log(coursesError);
    for (let i = 0; i < courses.length; i++) {
        const { error: studentCoursesError } = await supabase
            .from('student_courses')
            .insert({ student_id: studentId, course_id: courses[i].id, grade: null, name: courses[i].name, major_id: majorId });

        if (studentCoursesError) {
            console.error('Error adding course to student_courses:', studentCoursesError.message);
            throw new Error(studentCoursesError.message);
        }
    }

    return upsertData;
};

// Get student courses
exports.getStudentCourses = async (studentId) => {
    const { data, error } = await supabase
        .from('student_courses')
        .select('course_id, grade, name, major_id')
        .eq('student_id', studentId);

    if (error) throw new Error(error.message);
    return data;
};

// Save student grades
exports.saveStudentGrades = async (studentId, grades) => {
    for (const course of grades) {
        const { data, error } = await supabase
            .from('student_courses')
            .update({ grade: course.grade })
            .eq('student_id', studentId)
            .eq('course_id', course.course_id);

        if (error) throw new Error(error.message);
    }
};