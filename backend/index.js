const express = require('express');
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');
const os = require('os');
const mongodb = require('mongodb');



const {generateFile} = require('./generateFile');

const {addJobToQueue} = require('./jobQueue');
const Job = require("./models/job");

mongoose.connect('mongodb://localhost/GubOJ',
{
  useNewUrlParser: true,
  
},console.log("sucessfully connected to db")
);


app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());



app.get('/status',async(req,res)=>{
   //localhost:5000/status?id=
   const jobId = req.query.id;
   if(jobId == undefined){
      console.log("job id not undefined")
       return res
            .status(400)
            .json({success : false, error: "missing id quory "})
   }
   try{

       const job = await  Job.findById(jobId);

         if(job === undefined){
            return res.status(404).json({success:false,error:"invalied job id"});
         }else{
            return res.status(200).json({success:true,job});

         }
        
      }
      catch(err){
      return res.status(400).json({success:false, error:JSON.stringify(err)});
   }

});
app.delete('/delete', async(req,res)=>{
   const jobId = req.query.id;
   if(jobId == undefined){
      console.log("job id not undefined")
       
   }try{  
           const result = await Job.deleteOne({"_id": new mongodb.ObjectId(jobId)});
           console.log(result);
        }        
     catch(err){
     //return res.status(400).json({success:false, error:JSON.stringify(err)});
  }

});


app.post ('/submit',async (req,res)=>{ 

   const {language='cpp',code} = req.body;
   const submitType = req.body.SubmitType;
   const userInput = req.body.userInput;
   console.log("userInput: "+ userInput);
      //console.log('total memory : ' + os.totalmem() + " bytes.");
     // console.log('free memory : ' + os.freemem() + " bytes.");

   
  if(code === undefined){
     return res.status(400).json({success:false, error:"Empty code body!"});
   }
   
    try{
        //need to generate a c++ file with content from the request 
        const filepath = await generateFile(language,code);
        // we need to run the file and send the response

         const job = await new Job({language,filepath,submitType,userInput}).save();
        // console.log("job from index :" + job);
        
        const jobId = job["_id"];
        addJobToQueue(jobId,filepath);
       res.status(201).json({success:true,jobId});
       
        
    }catch(err){
       return res.status(500).json({success:false, err: JSON.stringify(err)});
    }
       
});




app.listen(5000,()=>{
    console.log("listening on port 5000")
})

