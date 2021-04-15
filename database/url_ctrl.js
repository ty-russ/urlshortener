
const url_mdl = require('./url_mdl');

function create_url (data){
    return new Promise( function(resolve,reject){
      try {
           let doc = url_mdl({
             original_url:data
           })
           doc.save(function (err,record){
             if(err) return reject(err);
             resolve(record)
           })
  
  
      } catch (err) {
        console.log(err)
        reject(err)
        
      }
        
    })
  }

  function reject_url(){

  }
  
module_exports = {
    create_url:create_url,
    reject_url:reject_url
  }