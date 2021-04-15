

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Autoincrement = require("mongoose-sequence")(mongoose);


let UrlSchema = new Schema({
    original_url:{type:String,required:true}
})
UrlSchema.plugin(Autoincrement,{inc_field : "short_url"});

const url_data = mongoose.model("url_data",UrlSchema)
module.exports = url_data

