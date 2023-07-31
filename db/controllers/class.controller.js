const { connect } = require('../db');


class ClassController {

    db = {};

    constructor() {
        this.db = connect();
        // For Development
        // this.db.sequelize.sync({ force: true });
    }

    /**
     * Get Enrolled Classes
     */
    async getClasses(userId) {
        const user = await this.db.user.findByPk(userId)
        return await user.getClasses()
    }

    /**
     * Get Owned Classes
     */
    async getMyClasses(userId) {
        const user = await this.db.user.findByPk(userId)
        return await user.getMyClasses()
    }

    /**
     * Add New Class
     */
    async addClass(userId,classData){
        try{
            const user = await this.db.user.findByPk(userId)
            const _class = await user.createMyClass(classData)  // create class set it as user's owned class
            await _class.setTeacher(user)                       // set user as class's owner
            return ({success:"Create Class: Operation Complete"})
        }catch(err){
            console.log(err)
            return ({error:"Create Class: Internal Server Error"})
        }
    }
    
    /**
     * Delete Class
     */
    async deleteClass(userId,classId){
        try{
            const user = await this.db.user.findByPk(userId)
            const _class = await this.db.class.findByPk(classId)
            if(user.hasMyClass(_class)){                              // check if user owns the class
                await this.db.class.destroy({where:{id:classId}})   // Delete Class
                return ({success:"Delete Class: Operation Complete"})
            }
            else{
                return({error:"Delete Class: Access denied!!"})
            }
        }catch(err){
            console.log(err)
            return ({error:"Delete Class: Internal Server Error"})
        }
    }




    /**
     * Get Student List
     */
    async getStudents(userId,classId){
        try{
            const user = await this.db.user.findByPk(userId)
            const _class = await this.db.class.findByPk(classId)
            if(user.hasMyClass(_class)|| user.hasClass(_class)){    // check if user owns the class or is in class
                const students = await _class.getStudents()
                return ({students})
            }
            else{
                return({error:"Get students: Access denied!!"})
            }
        }catch(err){
            console.log(err)
            return ({error:"Get students: Internal Server Error"})
        }
    }

    /**
     * Add Students
     */
    async addStudents(userId,classId,studentList){
        try{
            const user = await this.db.user.findByPk(userId)
            const _class = await this.db.class.findByPk(classId)
            if(user.hasMyClass(_class)){                            // check if user owns the class
                const students = await this.db.user.findAll({where:{email:studentList}})

                const found = students.map((student)=>student.email)
                const notFound = studentList.filter((student)=>!found.includes(student)) // list of emails which were not found in the database

                await _class.addStudents(students)                                 // add students to class
                students.map(async(student)=>await student.addClass(_class))       // add class to students

                //Response
                const response = {}
                if(notFound.length==1 && studentList.length==1){
                    response.error = "Email Not Found!!"
                }
                else if(notFound.length>1){
                    response.error = notFound.length+" emails were not found!!"
                }
                else if(notFound.length==1){
                    response.error = "one email was not found"
                }
                else{
                    response.success = "Add students: Operation Complete"
                }

                return response
            }
            else{
                return({error:"Add students: Access denied!!"})
            }
        }catch(err){
            console.log(err)
            return ({error:"Add students: Internal Server Error"})
        }
    }

}

module.exports = new ClassController();