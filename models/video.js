const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator');

delete mongoose.connection.models['Video'];

const VideoSchema = new Schema( {
    title: {
        type : String, 
        required : true,
        index: true
    },
    artist: {
        type : String, 
        required : true,
        index: true
    },
    video_url: {
        type : String, 
        required : true, 
        unique : true
    },
    video_img_url: {
        type: String,
        required: true,
        default: "https://i.stack.imgur.com/PtbGQ.png"
    },
    short_description: {
        type : String,
        required: true
    },
    duration: Number,
    adding_date: {
        type: Date, 
        default : Date.now()
    },
    uploader_id: {
        type: Schema.Types.ObjectId,
        ref: 'User', // or 'UserSchema
        required: true
    },
    reports : {
        type: Number,
        default: 0
    },
    reportedBy : [{
        type: Schema.Types.ObjectId,
        ref: 'User' 
    }],
    languages: [String],
    tags: [{
        type: String,
        index: true
    }]
})

// VideoSchema.index({title: "text", artist: "text", tags: "text"})  // need for search query in videoRouter get method

VideoSchema.plugin(uniqueValidator);

const Video = mongoose.model.Video || mongoose.model('Video', VideoSchema)

module.exports = {
    VideoSchema: VideoSchema,
    Video: Video
};