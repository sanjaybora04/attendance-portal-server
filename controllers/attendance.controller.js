const { connect } = require('../db/db');
const fastcsv = require('fast-csv')


class AttendanceController {

    db = {};

    constructor() {
        this.db = connect();
        // this.db.sequelize.sync({ force: true }); // For Development
    }

    /**
     * Get Enrolled Classes
    */
    async postAttendance(userId, classId, attendanceList) {
        try {
            const user = await this.db.user.findByPk(userId)
            const _class = await this.db.class.findByPk(classId)

            if (user.hasMyClass(_class)) {                              // check if user owns the class
                const attendance = await _class.createAttendance()
                await attendance.setClass(_class)
                await attendanceList.map(async (email) => {
                    const student = await this.db.user.findOne({ where: { email } })
                    await student.addAttendance(attendance)
                    await attendance.addStudent(student)
                })

                return ({ success: "Attendance Marked Successfully" })
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

}

module.exports = new AttendanceController();