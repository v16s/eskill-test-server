const { Schema, model } = require('mongoose')
let { reject } = require('lodash')
let Course = new Schema({
  name: { type: String, required: true },
  session: [String]
})
let branchSchema = new Schema({
  courses: [Course],
  name: { type: String, required: true }
})

branchSchema.methods.addCourse = function (name, callback) {
  this.courses.push(new Course({ name }))
  this.markModified('courses')
  this.save((err, modified) => callback(err, modified))
}

branchSchema.methods.removeCourse = function (name, callback) {
  this.courses = reject(this.courses, { name })
  this.markModified('courses')
  this.save((err, modified) => callback(err, modified))
}

branchSchema.methods.editCourse = function (name, newName, callback) {
  this.courses = this.courses.map(d =>
    d.name == name ? { ...d, name: newName } : d
  )
  this.markModified('courses')
  this.save((err, modified) => callback(err, modified))
}

module.exports = model('branch', branchSchema)
