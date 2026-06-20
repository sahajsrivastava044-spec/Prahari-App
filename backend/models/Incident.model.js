const mongoose=require('mongoose');

const incidentSchema = new mongoose.Schema(
  {
    incidentType: {
      type: String,
      required: true,
      trim: true,
      enum: ['sighting', 'livestock_attack', 'pugmark', 'roar', 'human_encounter'], // example categories
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    imageUrl: {
      type: String,
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(v);
        },
        message: 'Invalid image URL format',
      },
    },
    audioUrl: {
      type: String,
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+\.(mp3|wav|ogg)$/i.test(v);
        },
        message: 'Invalid audio URL format',
      },
    },
    location: {
      lat: {
        type: Number,
        required: true,
        min: -90,
        max: 90,
      },
      lng: {
        type: Number,
        required: true,
        min: -180,
        max: 180,
      },
    },
    village: {
      type: String,
      required: true,
      trim: true,
    },
    reporter:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"User"  
    },
    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    riskLevel: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high', 'critical'],
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'verified', 'resolved', 'dismissed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Incident = mongoose.model('Incident', incidentSchema);
module.exports=Incident
