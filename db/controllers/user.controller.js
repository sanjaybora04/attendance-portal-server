const axios = require('axios')
const jwt = require('jsonwebtoken')
const { connect } = require('../db');


class UserController {

    db = {};

    constructor() {
        this.db = connect();
        // this.db.sequelize.sync({ force: true });// For Development
    }

    /**
     * Signin
     */
    async signin(req) {
        try {

            const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { "Authorization": `Bearer ${req.body.token}` }
            })

            const name = response.data.name;
            const email = response.data.email;
            const profilePicture = response.data.picture;

            const existingUser = await this.db.user.findOne({ where: { email } })

            if (existingUser) {
                const token = jwt.sign({
                    id: existingUser.dataValues.id
                }, process.env.JWT_SECRET, { expiresIn: "24d" })

                return ({ token: token })
            }
            const newUser = await this.db.user.create({ name, email, profilePicture })

            const token = jwt.sign({
                id: newUser.dataValues.id
            }, process.env.JWT_SECRET, { expiresIn: "24d" })

            return ({ token })

        } catch(err){
            console.log(err)
            return ({ error: "Invalid access token!" })
        }
    }

    /**
     * Get User Profile
     */
    async getProfile(id) {
        return await this.db.user.findByPk(id)
    }

    /**
     * Update Profile
     */
    async updateProfile(req){
        try {
            await this.db.user.update({name:req.body.name,profilePicture:req.body.image},{where:{id:req.user.id}})
            return ({ success: "Update Profile: Operation Complete" })
      
        } catch (err) {
            console.log(err)
            return ({ error: "Update Profile: Internal Server Error" })
        }
    }
}

module.exports = new UserController();