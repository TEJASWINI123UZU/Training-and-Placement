


const mongoose=require("mongoose");


const compSchema=new mongoose.Schema({
	usn :{
        type:String,
        required:true

	},	
    sname :{
        type:String,
        required:true

    },
    comname :{
        type:String,
        required:true,
        unique:true

    },
    Date :{
        type:String,
        required:true

    },
    Attendance :{
        type:String,
        required:true

    },
	WrittenTest :{
        type:String,
        required:true

    },
	GD :{
        type:String,
        required:true

    },
	Tech :{
        type:String,
        required:true

    },
	Placed :{
        type:String,
        required:true

    }
	
})

const CUpdate = new mongoose.model("CUpdate",compSchema);

module.exports = CUpdate;