const mongoose = require("mongoose")

const studentsSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String
})

const Student = mongoose.model('Student', studentsSchema)

module.exports = Student;