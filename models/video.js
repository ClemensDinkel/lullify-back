const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator');

delete mongoose.connection.models['Video'];

const VideoSchema = new Schema( {
    title: {
        type : String, 
        required : true
    },
    artist: {
        type : String, 
        required : true
    },
    video_url: {
        type : String, 
        required : true, 
        unique : true
    },
    short_description: {
        type : String
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
    languages: [String],
    tags: [String]
})

VideoSchema.plugin(uniqueValidator);

const Video = mongoose.model.Video || mongoose.model('Video', VideoSchema)

module.exports = {
    VideoSchema: VideoSchema,
    Video: Video
};