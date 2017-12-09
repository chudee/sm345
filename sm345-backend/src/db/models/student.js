const mongoose = require('mongoose');

const { Schema } = mongoose;

const User = require('./user');
const Department = require('./department');
const Survey = require('./survey');

const Student = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    major: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    minor: { type: Schema.Types.ObjectId, ref: 'Department', required: false },
    surveys: [{ type: Schema.Types.ObjectId, ref: 'Survey', required: false }]
});

Student.statics.addStudent = function(user, name, address, phone, major, minor) {
    const student = new this({
        user: user,
        name: name,
        address: address,
        phone: phone,
        major: major,
        minor: minor
    })

    return student.save()
}

Student.statics.getStudentById = function(id) {
    return this.findById(id).exec();
}

Student.statics.getStudentByName = function(name) {
    return this.findOne({name: name}).exec();
}

Student.statics.applyMentor = async function(id) {
    const mentor = await this.getStudentById(id);
    return User.update({_id: mentor.user, auth: 0}, {$set: {auth: 2}}).exec();
}

Student.statics.withdrawMentor = function(id) {
    const mentor = this.getStudentById(id);
    return User.update({_id: mentor.user, auth: 2}, {$set: {auth: 0}}).exec();
}

Student.statics.applyMentee = function(id) {
    const mentee = this.getStudentById(id);
    return User.update({_id: mentee.user, auth: 0}, {$set: {auth: 1}}).exec();
}

Student.statics.withdrawMentee = function(id) {
    const mentee = this.getStudentById(id);
    return User.update({_id: mentee.user, auth: 1}, {$set: {auth: 0}}).exec();
}

Student.statics.applyAdmin = function(id) {
    const student = this.getStudentById(id);
    return User.update({_id: student.user}, {$set: {auth: 5}}).exec();
}

Student.statics.withdrawAdmin = async function(id) {
    const student = await this.getStudentById(id);
    return User.update({_id: student.user, auth: 5}, {$set: {auth: 0}}).exec();
}

module.exports = mongoose.model('Student', Student);