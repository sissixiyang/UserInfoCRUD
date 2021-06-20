var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate"); //first step
var Schema = mongoose.Schema;

var SoldierSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rank: {
      type: String,
      required: true,
    },
    sex: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    superior: {
      type: String,
      required: false,
    },
    superiorId: {
      type: mongoose.Types.ObjectId,
      required: false,
    },
    ds: {
      type: Number,
      default: 0,
    },
    imageUrl: {
      type: String,
      default: "assets/default.png",
    },
  },
  { versionKey: false }
);

SoldierSchema.plugin(mongoosePaginate); //second step

module.exports = mongoose.model("Soldier", SoldierSchema);
