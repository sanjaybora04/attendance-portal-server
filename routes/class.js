const router = require("express").Router();
const authCheck = require('../middleware/auth-check')
const User = require('../db/controllers/user.controller')
const Class = require('../db/controllers/class.controller');


// returns the list of classes and the list of class _ids with live attendance
router.post('/getClasses', authCheck, async (req, res) => {
    const response = await Class.getClasses(req.user.id)
    res.json(response)
})

// get My Classes
router.post('/getMyClasses', authCheck, async (req, res) => {
    const response = await Class.getMyClasses(req.user.id)
    res.json(response)
})

// Create new Class
router.post('/addClass', authCheck, async (req, res) => {
    const response = await Class.addClass(req.user.id,req.body)
    res.json(response)
})

// Delete a Class
// Todo: set timer of some days to delete but hide from the user dashboard, so that it can be recovered if needed
router.post('/deleteClass', authCheck, async (req, res) => {
    const response = await Class.deleteClass(req.user.id,req.body.class_id)
    res.json(response)
})


// Get students
router.post('/getStudents',authCheck, async(req,res)=>{
    const response = await Class.getStudents(req.user.id,req.body.class_id)
    res.json(response)
})

// Add students
router.post('/addStudents', authCheck, async(req,res)=>{
    const response = await Class.addStudents(req.user.id,req.body.class_id,req.body.students)
    res.json(response)
})

module.exports = router;