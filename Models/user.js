const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const UserSchema= mongoose.Schema(
    {
        name:{type:String,required:true},
        age:{type:Number,required:true},
        email:{type:String},
        mobile:{type:String},
        address:{type:String,required:true},
        adhaarCardNo:{type:Number,required:true,unique:true},
        password:{type:String,required:true},
        role:{type:String,enum:['voter','admin'],default:'voter'},
        isVoted:{type:Boolean,default:false}
    }
);
UserSchema.pre('save', async function(next) { // Corrected method definition
    const person = this;
    if (!person.isModified('password')) return next();
    try {
        const saltPassword = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(person.password, saltPassword);
        person.password = hashedPassword; // Corrected assignment
        next();
    } catch (err) {
        return next(err);
    }
})
UserSchema.methods.comparePassword=async function(candidatePassword){
    try{
        const isMatch=await bcrypt.compare(candidatePassword,this.password)
        return isMatch;
    }
    catch(err){
        throw err;
    }
}

const User=mongoose.model('UserModel',UserSchema);
module.exports=User;
