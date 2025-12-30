const mongoose=require('mongoose');
const {Schema}=mongoose;

const submissionScgema=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    

    problemId:{
        type:Schema.Types.ObjectId,
        ref:'problm',
        required:true
    },
    code:{
        type:String,
        required:true,
        
    },
    language:{
        type:String,
        required:true,
        enum:['javascript','cpp','java']
    },
    status:{
        type:String,
        enum:['pending','accepted','wrong','error'],
        default:'pending'
    },
    runtime:{
        type:Number,
        default: 0
    },
    memory:{
        type:Number,
        default:0
    },
    errorMessage:{
        type:String,
        default:''
    },
    testCasePassed:{
        type:Number,
        default:0
    },
    testCaseTotal:{
        type:Number,
        default:0
    }
},{timestamps: true});

const Submission = mongoose.model('submission',submissionScgema);

module.exports=Submission;