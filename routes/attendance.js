const router = require("express").Router();
const authCheck = require('../middleware/auth-check')
const Attendance = require('../controllers/attendance.controller')


// add new attendance
router.post('/postAttendance', authCheck, async (req, res) => {
    const response = await Attendance.postAttendance(req.user.id,req.body.class_id,req.body.attendanceList,req.body.date,req.body.attendanceId)
    res.json(response)
})

// get attendance percentage of a student in a class
router.post('/getAttendance', authCheck, async (req,res) => {
    const response = await Attendance.getAttendance(req.user.id, req.body.class_id, req.user.id)
    res.json(response)
})

// download attendance report of class
router.post('/getReport', authCheck, async(req,res)=>{
    const response = await Attendance.getReport(req.user.id,req.body.class_id)
    res.json(response)
})

// get Teacher Attendance data on specific date
router.post('/getTeacherAttendance',authCheck,async(req,res)=>{
    const response = await Attendance.getTeacherAttendance(req.user.id,req.body.class_id,req.body.date)
    res.json(response)
})

// get Student Attendance data on specific date
router.post('/getStudentAttendance',authCheck,async(req,res)=>{
    const response = await Attendance.getStudentAttendance(req.user.id,req.body.class_id,req.body.date)
    res.json(response)
})


module.exports = router;