const { Schema, model } = require('mongoose')
let { reject, remove, map, findIndex } = require('lodash')
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
branchSchema.methods.removeSession = function (name, session, callback) {
  this.courses = this.courses.map(d => {
    if (d.name == name) {
      remove(d.session, s => s === session)
    }
    return d
  })
  this.markModified('courses')
  return this.save()
}
branchSchema.methods.editSession = function (name, session, nSession, callback) {
  this.courses = this.courses.map(d => {
    if (d.name == name) {
      d.session = d.session.map(s => (s === session ? nSession : s))
    }
    return d
  })
  this.markModified('courses')
  return this.save()
}

module.exports = model('branch', branchSchema)
