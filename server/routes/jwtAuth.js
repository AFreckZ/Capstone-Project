const router = require("express").Router();
const pool = require("../db");

//registering
router.post("/register",async(req,res) => {
    try {
        console.log("Request body:", req.body);
        const {name ,email, password ,confirmpassword} = req.body;
        const user = await pool.query(`SELECT * FROM users WHERE user_email = $1`, [email]);
        
        res.json(user.rows);

    } catch (err){
        res.status(500).send("server error")
    }
})
module.exports = router;

