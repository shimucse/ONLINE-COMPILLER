const express = require('express');
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');


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

app.post ('/run',async (req,res)=>{ 

   const {language='cpp',code} = req.body;
   
  if(code === undefined){
     return res.status(400).json({success:false, error:"Empty code body!"});
   }
   let job;
    try{
        //need to generate a c++ file with content from the request 
        const filepath = await generateFile(language,code);
        // we need to run the file and send the response

         job = await new Job({language,filepath}).save();
        const jobId = job["_id"];
        addJobToQueue(jobId);
       res.status(201).json({success:true,jobId});
        
    }catch(err){
       return res.status(500).json({success:false, err: JSON.stringify(err)});
    }
       
});




app.listen(5000,()=>{
    console.log("listening on port 5000")
})
