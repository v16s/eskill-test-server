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
  branches: Array,
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
GlobalSchema.methods.addBranch = function (branch_name, callback) {
  this.branches.push(branch_name)
  this.save((err, nModified) => {
    callback(err, nModified.branches)
  })
}
GlobalSchema.methods.editBranch = function (branch_name, new_name, callback) {
  this.branches = this.branches.map(k => (k == branch_name ? new_name : k))
  this.save((err, nModified) => {
    callback(err, nModified.branches)
  })
}
GlobalSchema.methods.removeBranch = function (branch_name, callback) {
  var Branch = this.branches
  Branch = reject(Branch, d => d == branch_name)
  this.branches = Branch
  this.save((err, nModified) => {
    callback(err, nModified.branches)
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
