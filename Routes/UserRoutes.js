const express=require('express');
const router=express.Router()
const User=require('../Models/user')
const {jwtAuthMiddleware,generateToken}=require('./../jwt');


router.post('/signup',async(req,res)=>{
    try{
      const data=req.body;
      const newUser = new User(data);
      const response=await newUser.save();
      console.log('Data is saved');
      const payload={
        id:response.id
      }
      console.log(JSON.stringify(payload));
      const token=generateToken(payload);
      console.log("token is:",token);

      res.status(200).json({response: response,token:token});
    }
    catch(err)
    {
  console.log(err);
  res.status(500).json({error:'Internal server error'});
    }
  });

 


  //login route
router.post('/login',async(req,res)=>
{
  try{
      const {adhaarCardNo,password}=req.body;
      const user=await User.findOne({adhaarCardNo:adhaarCardNo});
      if(!user || !(await user.comparePassword(password))){
        return res.status(401).json({error:'invalid username or password'});
      }
      const payload={
        id:user.id
      }
      const token=generateToken(payload);
      res.json({token});
  }
  catch(err){
console.log(err);
res.status(401).json({error:'unauthorized error'});
  }
})

router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
  try{
    const userData=req.user;
    const userID=userData.id;
    const user=await User.findById(userID);
    res.status(200).json({user});
  }
  catch(err){
console.log(err);
res.status(500).json({error:'internal server error' });
  }
})

  

router.put('/profile/password',jwtAuthMiddleware,async(req,res)=>
{
    try{
        const get_id=req.user;
        const {currentPassword,newPassword}=req.body;
        const user=await User.findById(userId)

        if(!(await user.comparePassword(currentPassword))){
            return res.status(401).json({error:'invalid username or password'});
          }

          user.password=newPassword;
          await user.save();
        console.log('password updated');
        res.status(200).json({message:'password updated'});
    }
    catch(err){
        console.log(err)
        res.status(500).json({error:'internal server error'});
    }
})




module.exports=router;

        