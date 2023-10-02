const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    hardware: {
        type: Object,
    },
    connectivity: {
        type: Object,
    },
    management: {
        type: Object
    },
},
    { timestamps: true }
)

const Categorys = mongoose.model("Category", CategorySchema);

module.exports = { Categorys };
