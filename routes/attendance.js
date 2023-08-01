const router = require("express").Router();
const authCheck = require('../middleware/auth-check')
const Attendance = require('../db/controllers/attendance.controller')


// returns the list of classes and the list of class _ids with live attendance
router.post('/postAttendance', authCheck, async (req, res) => {
    const response = await Attendance.postAttendance(req.user.id,req.body.class_id,req.body.attendanceList)
    res.json(response)
})

router.post('/getAttendance', authCheck, async (req,res) => {
    const response = await Attendance.getAttendance(req.user.id, req.body.class_id, req.user.id)
    res.json(response)
})

router.post('/getReport', authCheck, async(req,res)=>{
    const response = await Attendance.getReport(req.user.id,req.body.class_id)
    res.json(response)
})


module.exports = router;