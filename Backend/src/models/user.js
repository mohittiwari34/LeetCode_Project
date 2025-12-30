const mongoose=require('mongoose');
const {Schema}=mongoose;

const userSchema=new Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20

    },
    lastName:{
        type:String,
        minLength:3,
        maxLength:20

    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        immutable:true,

    },
    age:{
        type:Number,
        min:6,
        max:90,
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    provider:{
        type:String,
        enum:["local","google"],
        default:"local",
    },
    password:{
        type:String,
        required:function(){
            return this.provider==="local";
        }
    },
    problemSolved:{
        type:[{
            type:Schema.Types.ObjectId,
            ref:'problem',
            unique:true
        }],
        
    },
    profilePhoto:{
        // url:{
        //     type:String,
        //     default:"",
        // },
        // publicId:{
        //     type:String,
        //     default:"",
        // }
        type:String,
        default:""
    }

},{
    timestamps:true
});
userSchema.post('findOneAndDelete',async function (userInfo){
    if(userInfo){
        await mongoose.model('submission').deleteMany({userId:userInfo._id});
    }
})
const User=mongoose.model("user",userSchema);
module.exports=User;