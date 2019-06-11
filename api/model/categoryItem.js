const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CategoryItemSchema = new Schema({
    name: {
      type: String, 
      required: true
    }
})

CategoryItemSchema.set('timestamps', true);
module.exports = mongoose.model('CategoryItem', CategoryItemSchema);