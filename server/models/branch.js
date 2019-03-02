const { Schema, model } = require('mongoose')
let { reject, map } = require('lodash')
let Course = new Schema({
  name: { type: String, required: true },
  session: [String]
})
let branchSchema = new Schema({
  courses: [Course],
  name: { type: String, required: true }
})

branchSchema.methods.addCourse = function (name, callback) {
  this.courses.push({ name })
  this.markModified('courses')
  return this.save()
}

branchSchema.methods.removeCourse = function (name, callback) {
  this.courses = reject(this.courses, { name })
  this.markModified('courses')
  return this.save()
}

branchSchema.methods.editCourse = function (name, newName, callback) {
  this.courses = map(this.courses, d => {
    if (d.name == name) {
      return { session: d.session, name: newName }
    }
    return { session: d.session, name: d.name }
  })
  this.markModified('courses')
  return this.save()
}

module.exports = model('branch', branchSchema)
