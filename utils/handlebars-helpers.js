const { basket } = require('../dbs/basketDB.js');

const handlebarsHelpers={
    multiplyAmount:(val)=>val*1000,
}


module.exports = {
    handlebarsHelpers,
}