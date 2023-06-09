const mongoose = require('mongoose');

const JobSchema = mongoose.Schema({

    language: {
        type : String,
        required:true,
        enum:["cpp", "py"]
    },
    filepath:{
        type:String,
        required:true,
    },
    submittedAt:{
        type:Date,
        default:Date.now
    },
    startedAt:{
        type:Date
    },
    completedAt:{
        type:Date
    },
    input : { 
        type : String
    },
    output:{
        type:String
    },
    problemSetterAllInputOutputTestCase:[
        {
          setterInput:{type:String},
          setterOutput:{ type:String}
  
      }
    ],
    status:{
        type:String,
        default:"pending",
        enum:["pending","success","error"]


    },
    memorySpace:{
        type:Number

    },
    submitType:{
        type:String
    },
    
   
    problemId :{
        type:String
    }




});

const Job = new mongoose.model('job', JobSchema)


module.exports = Job;