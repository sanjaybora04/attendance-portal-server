const { connect } = require('../db/db');
const fastcsv = require('fast-csv')
const { Op } = require('sequelize');


class AttendanceController {

    db = {};

    constructor() {
        this.db = connect();
        this.db.sequelize.sync({ force: true }); // For Development
    }

    /**
     * Get Enrolled Classes
    */
    async postAttendance(userId, classId, attendanceList,date, attendanceId) {
        try {
            date = new Date(date)
            const user = await this.db.user.findByPk(userId)
            const _class = await this.db.class.findByPk(classId)

            if (user.hasMyClass(_class)) {                              // check if user owns the class
                if(attendanceId==null){                             // if attendanceId is null create new attendance else update the existing attendance
                    const attendance = await _class.createAttendance({createdAt:date})
                    await attendance.setClass(_class)
                    await attendanceList.map(async (email) => {
                        const student = await this.db.user.findOne({ where: { email } })
                        await student.addAttendance(attendance)
                        await attendance.addStudent(student)
                    })
                    
                    return ({ success: "Attendance Marked Successfully" })
                }
                else{
                    const attendance = await this.db.attendance.findByPk(attendanceId)
                    if(_class.hasAttendance(attendance)){                       // check if attendance belongs to class
                        // Remove old attendances
                        const old = await attendance.getStudents()
                        await old.map(async(student)=>{
                            attendance.removeStudent(student)
                            student.removeAttendance(attendance)
                        })
                        // Add new Attendances
                        await attendanceList.map(async (email) => {
                            const student = await this.db.user.findOne({ where: { email } })
                            await student.addAttendance(attendance)
                            await attendance.addStudent(student)
                        })
                        
                        return ({ success: "Attendance Updated Successfully" })
                    }
                    else{
                        return({error: "Update Attendance: Access denied"})
                    }
                }
            }
            else {
                return ({ error: "Post Attendance: Access denied!!" })
            }
        } catch (err) {
            console.log(err)
            return ({ error: "Post Attendance: Internal Server Error" })
        }
    }

    /**
     * Get Attendance
     */
    async getAttendance(userId, classId, studentId) {
        try {
            const user = await this.db.user.findByPk(userId)
            const _class = await this.db.class.findByPk(classId)

            if (user.hasMyClass(_class) || user.hasClass(_class)) {    // check if user owns the class or is in class
                const total = await _class.countAttendances()
                const attended = await this.db.attendance.count({
                    where: {},
                    include: [
                        {
                            model: this.db.user,
                            as: 'Students',
                            where: { id: studentId },
                        },
                        {
                            model: this.db.class,
                            as: 'Class',
                            where: { id: classId },
                        },
                    ],
                });

                let attendance = 100
                if (total > 0) {
                    attendance = attended / total * 100
                }
                return ({ attendance })
            }
            else {
                return ({ error: "Get Attendance: Access denied!!" })
            }
        } catch (err) {
            console.log(err)
            return ({ error: "Get Attendance: Internal Server Error" })
        }
    }

    /** 
     * Get Report
    */
    async getReport(userId, classId) {
        try {
            const user = await this.db.user.findByPk(userId)
            const _class = await this.db.class.findByPk(classId)
            const students = await _class.getStudents({ raw: true })
            if (user.hasMyClass(_class)) {    // check if user owns the class
                const total = await _class.countAttendances();
                const studentsWithAttendance = [];

                for (const student of students) {
                    const attended = await this.db.attendance.count({
                        where: {
                            '$Students.id$': student.id,
                            '$Class.id$': classId,
                        },
                        include: [
                            {
                                model: this.db.user,
                                as: 'Students',
                            },
                            {
                                model: this.db.class,
                                as: 'Class',
                            },
                        ],
                    });

                    let attendance = 100;
                    if (total > 0) {
                        attendance = (attended / total) * 100;
                    }
                    const studentWithAttendance = {
                        name: student.name,
                        email: student.email,
                        attendance
                    }
                    studentsWithAttendance.push(studentWithAttendance);
                }

                // Convert the list of objects to a CSV string
                const csvString = await fastcsv.writeToString(studentsWithAttendance, { headers: true, delimiter: ',' })

                return { report: csvString };

            }
            else {
                return ({ error: "Get Attendance: Access denied!!" })
            }
        } catch (err) {
            console.log(err)
            return ({ error: "Get Attendance: Internal Server Error" })
        }
    }

    /**
     * Get Teacher Attendance data on specific date
     */
    async getTeacherAttendance(userId, classId, date) {
        try {
            date = new Date(date)

            const user = await this.db.user.findByPk(userId)
            const _class = await this.db.class.findByPk(classId)

            if (user.hasMyClass(_class)) {    // check if user owns the class
                const attendances = await _class.getAttendances({
                    where: {
                        createdAt: {
                            [Op.eq]: date    // get all attendances in that day
                        }
                    },
                    include: [
                        {
                            model: this.db.user,
                            as: "Students",
                            attributes: ['email']
                        }
                    ]
                })
                return ({attendances})
            }
            else {
                return ({ error: "Get Attendance Data: Access denied!!" })
            }
        } catch (err) {
            console.log(err)
            return ({ error: "Get Attendance Data: Internal Server Error" })
        }
    }

    /**
     * Get Student Attendance data on specific date
     */
    async getStudentAttendance(userId, classId, date) {
        try {
            date = new Date(date)

            const user = await this.db.user.findByPk(userId)
            const _class = await this.db.class.findByPk(classId)

            if (user.hasClass(_class)) {    // check if user belongs to class
                const attendances = await _class.getAttendances({
                    where: {
                        createdAt: {
                            [Op.eq]: date    // get all attendances in that day
                        }
                    },
                    include: [
                        {
                            model: this.db.user,
                            as: "Students",
                            attributes: ['email'],
                            where:{id:userId},
                            required: false
                        }
                    ]
                })
                return ({attendances})
            }
            else {
                return ({ error: "Get Attendance Data: Access denied!!" })
            }
        } catch (err) {
            console.log(err)
            return ({ error: "Get Attendance Data: Internal Server Error" })
        }
    }

}

module.exports = new AttendanceController();