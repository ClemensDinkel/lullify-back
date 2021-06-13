const mongoose = require('mongoose');
const Schema = mongoose.Schema;

delete mongoose.connection.models['request'];

const RequestSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    req_date: { 
        type: Date, 
        default: Date.now() 
    }
})

const Request = mongoose.model.Request || mongoose.model('Request', RequestSchema)  

module.exports = {
    RequestSchema: RequestSchema,
    Request: Request
}; 