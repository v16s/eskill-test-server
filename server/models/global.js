let mongoose = require('mongoose')
let Schema = mongoose.Schema
let { reject } = require('lodash')

const GlobalSchema = new Schema({
  id: {
    type: Number,
    unique: true
  },
  studentreg: Boolean,
  facultyreg: Boolean,
  cooordinatorreg: Boolean,
  campus: Array,
  departments: Array
})

GlobalSchema.methods.toggleStudentRegistration = function (callback) {
  this.studentreg = !this.studentreg
  this.save((err, nModified) => {
    callback(err, nModified.studentreg)
  })
}

GlobalSchema.methods.toggleFacultyRegistration = function (callback) {
  this.facultyreg = !this.facultyreg
  this.save((err, nModified) => {
    callback(err, nModified.facultyreg)
  })
}
GlobalSchema.methods.addCampus = function (campus_name, callback) {
  this.campus.push(campus_name)
  this.save((err, nModified) => {
    callback(err, nModified.campus)
  })
}
GlobalSchema.methods.editCampus = function (campus_name, new_name, callback) {
  this.campus = this.campus.map(k => (k == campus_name ? new_name : k))
  this.save((err, nModified) => {
    callback(err, nModified.campus)
  })
}
GlobalSchema.methods.removeCampus = function (campus_name, callback) {
  var Campus = this.campus
  Campus = reject(Campus, d => d == campus_name)
  this.campus = Campus
  this.save((err, nModified) => {
    callback(err, nModified.campus)
  })
}

GlobalSchema.methods.addDepartment = function (dept_name, callback) {
  this.departments.push(dept_name)
  this.save((err, nModified) => {
    callback(err, nModified.departments)
  })
}

GlobalSchema.methods.removeDepartment = function (dept_name, callback) {
  var Department = this.departments
  Department = reject(Department, d => d == dept_name)
  this.departments = Department
  this.save((err, nModified) => {
    callback(err, nModified.departments)
  })
}
GlobalSchema.methods.editDepartment = function (dept_name, new_name, callback) {
  this.departments = this.departments.map(k => (k == dept_name ? new_name : k))
  this.save((err, nModified) => {
    callback(err, nModified.departments)
  })
}
module.exports = mongoose.model('Global', GlobalSchema)
