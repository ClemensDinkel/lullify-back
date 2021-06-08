const mongoose = require('mongoose')
const Schema = mongoose.Schema

delete mongoose.connection.models['Playlist']; 

const PlaylistSchema = new Schema({
    name: {type: String, required: true}
})

const Playlist = mongoose.model.Playlist || mongoose.model('Playlist', PlaylistSchema)

module.exports = {
    PlaylistSchema: PlaylistSchema,
    Playlist: Playlist
}