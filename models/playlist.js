const mongoose = require('mongoose');
const Schema = mongoose.Schema;

delete mongoose.connection.models['Playlist'];

const PlaylistSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    video_list: [{
        type: Schema.Types.ObjectId,
        ref: 'Video' 
    }],
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Playlist = mongoose.model.Playlist || mongoose.model('Playlist', PlaylistSchema)  

module.exports = {
    PlaylistSchema: PlaylistSchema,
    Playlist: Playlist
}; 