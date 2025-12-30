const validator=require('validator');

const validate=(data)=>{
    console.log(data);
    
    const mandatoryFields=['firstName','emailId','password'];
    const isAlowed=mandatoryFields.every((k)=>Object.keys(data).includes(k));
    console.log(isAlowed);
    if(!isAlowed){
        throw new Error("some Field Missing");

    }
    if(!validator.isEmail(data.emailId)){
        throw new Error("Invalid Email");
    }
    if(!validator.isStrongPassword(data.password)){
        throw new Error("weak password");
    }

}
module.exports=validate;