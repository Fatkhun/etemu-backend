const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const FoundedItemSchema = new Schema({
    category: {
      type: String, 
      required: true
    },
    detail: {
      type: String, 
      required: true
    },
    contact: {
      type: String, required: true
    },
    itemImage: {
      type: String,
      required: true
    },
    itemType: {
      type: String,
      required:true,
      default: 'foundeditem'
    }
})

FoundedItemSchema.set('timestamps', true)
module.exports = mongoose.model('FoundedItem', FoundedItemSchema);