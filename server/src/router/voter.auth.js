const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');

const router = express.Router();

require("../db/conn");

const Voter = require("../models/voter.model");
const Candidate = require("../models/candidate.model");
// const verifyToken = require('../middleware/auth');
// const authUser = require("../middleware/auth");

// const middleware = (req, res, next) => {
//   console.log(`Hello Miidleware`);
//   next();
// };

router.get("/", (req, res) => {
  res.send(`Hello Home`);
});

router.get("/about", (req, res) => {
  res.send("Hello About");
});

router.get("/news", (req, res) => {
  res.send("Hello news");
});

// router.get("/election", middleware, (req, res) => {
//   res.send("Hello election");
// });

/*******************************************************************************************/
router.get("/candidates",  async(req, res) => {
    const allusers = await Candidate.find({})
    .then(candidates=>res.json(candidates))
    .catch(err=>res.json(err));
});

// router.get("/profile", verifyToken, async (req, res) => {
//     const userId = req.id;
//     let user;
//     try{
//       user = Voter.findById(userId)
//     }
//     catch(err){
//       console.log(err);
//     }
//     if(!user){
//       return res.status(404).json({message:"User not Found"});
//     }
//     return res.status(200).json({user})
// });

router.get("/register", (req, res) => {
  res.send("Hello Voter");
});

router.get("/candidateregister" , (req,res) =>{
  res.send("Register Here")
})

router.get("/login", (req, res) => {
  res.send("Hello user");
  res.cookie("jwt")
});

/*****************************************Voter Registration**********************************************************/

router.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const {
      fullName,
      dateOfBirth,
      gender,
      phone,
      email,
      citizen,
      aadharNumber,
      birthPlace,
      username,
      password,
      confirmPassword,
    } = req.body;
    
    if (
      !fullName ||
      !dateOfBirth ||
      !gender ||
      !phone ||
      !email ||
      !citizen ||
      !aadharNumber ||
      !birthPlace ||
      !username ||
      !password ||
      !confirmPassword
    ) {
      return res.status(422).json({ error: "Please fill valid details" });
    }

    const voterExist = await Voter.findOne({
      username: username,
      email: email,
      aadharNumber: aadharNumber,
      phone: phone,
    });

    if (voterExist) {
      return res.status(422).json({ error: "Username already exists" });
    } else if (password != confirmPassword) {
      return res.status(422).json({ error: "Password not matched" });
    }

    const voter = new Voter({
      fullName,
      dateOfBirth,
      gender,
      phone,
      email,
      citizen,
      aadharNumber,
      birthPlace,
      username,
      password,
      confirmPassword,
    });

    await voter.save();
    res.status(201).json({ message: "Voter Registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

//********************************************************************************************************************************/

router.post("/candidateregister" , async(req,res) =>{
  try{
    console.log(req.body);
    const{
      fullname,
      birthdate,
      gender,
      citizen,
      birthplace,
      aadharnumber,
      partyaffiliated,
      networth,
      email,
      username,
      password,
      confirmpassword,
    }=req.body;

    if(
      !fullname ||
      !birthdate ||
      !gender ||
      !citizen ||
      !birthplace ||
      !aadharnumber ||
      !partyaffiliated ||
      !networth ||
      !email ||
      !username ||
      !password ||
      !confirmpassword 
    ) {
      return res.json(422).json({error: "Please fill Valid Details"});
    }

    const candidateExist = await Candidate.findOne({
      username:username,
      email: email,
      aadharnumber: aadharnumber,
    });

    if(candidateExist){
      return res.json(422).json({error:"Username already Exists"});
    } else if(password != confirmpassword) {
      return res.status(422).json({ error: "Password not matched" });
    }

    const candidate = new Candidate({
      fullname,
      birthdate,
      gender,
      citizen,
      birthplace,
      aadharnumber,
      partyaffiliated,
      networth,
      email,
      username,
      password,
      confirmpassword,
    });

    await candidate.save();
    res.status(201).json({message:"Candidate Registered Sucessfully"})
  }
  catch(err){
    console.log(err);
    res.status(500).json({ error: err });
  }
});

/**********************************SignIn**********************************/

// router.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     if (!username || !password) {
//       res.status(400).json({ message: "Please fill proper credentials" });
//     }

//     const voterLogin = await Voter.findOne({ username: username});
//     const candidateLogin = await Candidate.findOne({username:username});
//     if (voterLogin) {
//       const isMatched = await bcrypt.compare(password, voterLogin.password);

//       if (!isMatched) {
//         res.status(400).json({ error: "Fill Valid Credentials" });
//       }
//       else {
//         const token = voterLogin.generateAuthToken();
       
//         res.cookie("jwt", token , {
//         expires: new Date(Date.now() + 2589200000),
//         httpOnly: true,
//     });
//      return res.json({ message: "User SignIn Sucessful" });

//       }
    
    
//     }

//     else if(candidateLogin) {
//       const isSame = await bcrypt.compare(password,candidateLogin.password);

//       if(!isSame) {
//         res.status(400).json({ error: "Fill Valid Credentials" });
//       }
//       else {
//         console.log(req.body);
//         const token1 = candidateLogin.generateAuthToken();
//       console.log(token1);
//       res.cookie("jwtoken", token1 , {
//       expires: new Date(Date.now() + 2589200000),
//       httpOnly: true,
//     });
//   }
//      return res.json({message:"User Signin Sucessful"});
//     }

    
    
    
//      else {
//       return res.json({
//         message: "Invalid Credentials",
//       });
//     }
    
//   } catch (err) {
//     console.log(err);
//   }
  

// });

//#########################Login Page##################################################

router.post('/login' , async(req,res)=>{
    try{
      const { username, password } = req.body;
      if (!username || !password) {
      res.status(400).json({ message: "Please fill proper credentials" });
    }

    const voterLogin = await Voter.findOne({ username: username});
    const candidateLogin = await Candidate.findOne({username:username});

    if (voterLogin) {
      const isMatched = await bcrypt.compare(password, voterLogin.password);

      if (!isMatched) {
        res.status(400).json({ error: "Fill Valid Credentials" });
      }
      else {
        const token = jwt.sign({username:voterLogin.username , id:voterLogin._id},process.env.SECRET_KEY);
        res.json({user:voterLogin , token:token});
        
        // return res.json({ message: "User SignIn Sucessful" });

      }
    
    
    }

    else if(candidateLogin) {
      const isSame = await bcrypt.compare(password,candidateLogin.password);

      if(!isSame) {
        res.status(400).json({ error: "Fill Valid Credentials" });
      }
      else {
        const token = jwt.sign({username:candidateLogin , id:candidateLogin._id}, process.env.SECRET_KEY);
        res.json({user:candidateLogin , token:token});
        // return res.json({message:"User Signin Sucessful"});
        
       }
      }
     
    

    else {
      return res.json({
        message: "Invalid Credentials",
      });
    }


    }
    catch(err){
        console.log(err);
    }
})




module.exports = router;
