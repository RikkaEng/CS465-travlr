var fs = require('fs');                                               // <<-- added
var trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8')); // <<-- added

/* GET travel view */
const travel = (req, res) => {
    res.render ('travel', { title: 'Travlr Getaways', trips}); // <-- added trips changed
};

module.exports = {
    travel
};