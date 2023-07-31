const express = require('express');
const cors = require('cors');



//Root routes
const user = require('./routes/user');
const _class = require('./routes/class')
const attendance = require('./routes/attendance')



const app = express();


app.use(cors());
app.use(express.json({ limit: '5mb' }))


// Routes
app.use('/',user)
app.use('/',_class)
app.use('/',attendance)


app.listen(5000,()=>{
    console.log("server started at Port : 5000");
})