const router = require("express").Router();
const authCheck = require('../middleware/auth-check')
const Class = require('../controllers/class.controller');
const Attendance = require('../controllers/attendance.controller')


// get Student Classes
router.post('/getStudentClasses', authCheck, async (req, res) => {
    const classes = await Class.getClasses(req.user.id)
    for (const _class of classes) {
        _class.attendance = (await Attendance.getAttendance(req.user.id,_class.id,req.user.id)).attendance
    }
    res.json(classes)
})

// get Teacher Classes
router.post('/getTeacherClasses', authCheck, async (req, res) => {
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


// Get Class Data
router.post('/getClass',authCheck, async(req,res)=>{
    const response = await Class.getClass(req.user.id,req.body.class_id)
    res.json(response)
})

// Add students
router.post('/addStudents', authCheck, async(req,res)=>{
    const response = await Class.addStudents(req.user.id,req.body.class_id,req.body.students)
    res.json(response)
})

module.exports = router;