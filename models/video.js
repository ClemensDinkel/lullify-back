const mongoose = require('mongoose')
const Schema = mongoose.Schema
/* const uniqueValidator = require('mongoose-unique-validator'); */
/* const {UserSchema} */

// const User = require('./User')

delete mongoose.connection.models['Video'];

const VideoSchema = new Schema( {
    title: {
        type : String, required : true
    },
    artist: {
        type : String, required : true
    },
    video_url: {
        type : String, required : true
    },
    short_description: {
        type : String
    },
    legal_information: {
        type : String, required : true
    },
    duration: Number,
    adding_date: {
        type: Date, 
        default : Date.now()
    },
    uploader: {
        type: Schema.Types.ObjectId,
        ref: 'User' // or 'UserSchema
    },
    languages: [String],
    tags: [String]
    
})

/* VideoSchema.plugin(uniqueValidator); */

const Video = mongoose.model.Video || mongoose.model('Video', VideoSchema)

module.exports = {
    VideoSchema: VideoSchema,
    Video: Video
};