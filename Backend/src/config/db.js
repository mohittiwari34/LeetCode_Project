const mongoose=require('mongoose');
async function Main(){
    await mongoose.connect(process.env.DB_CONNECT_STRING)
}
module.exports=Main;