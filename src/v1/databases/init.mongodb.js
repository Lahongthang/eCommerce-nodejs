const mongoose = require('mongoose');
const { MONGODB_URI } = require('../configs/app');

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connect to mongodb success!'))
    .catch((err) => console.error('Mongodb connection error: ', err));

mongoose.set('debug', true);

mongoose.set('debug', { color: false });

mongoose.set('debug', { shell: true });

module.exports = mongoose;
