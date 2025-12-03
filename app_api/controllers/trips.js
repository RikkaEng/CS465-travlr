const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model
const Model = mongoose.model('trips');

// GET: /trips - lists all the trips
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsList = async(req, res) => {
    const q = await Model
        .find({}) // No filter, return all records
        .exec();

        // Uncomment the following line to show results of querey
        // on the console
        // console.log(q);

    if(!q)
    { // Database returned no data
        return res
            .status(404)
            .json({ message: 'No trips found' });
    } else { // Return resulting trip list
        return res  
            .status(200)
            .json(q);
    }
};

// GET: /trips/:tripCode - lists a single trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsFindByCode = async(req, res) => {
    const q = await Model
    .find({'code' : req.params.tripCode }) // return single record
    .exec();

    // Uncomment the following line to show results of querey
    // on the console
    // console.log(q);

    if(!q)
    { // Database returned no data
        return res
                .status(404)
            .json({ message: 'Trip not found' });
        } else { // Return resulting trip list
            return res
                .status(200)
                .json(q);
            }
};


// POST: /trips - Adds a new Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsAddTrip = async(req, res) => {
    const newTrip = new Trip({
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
    });

    try {
        const q = await newTrip.save();
        return res
            .status(201)
            .json(q);
    } catch(err) {
        // Mongoose validation errors come through here automatically
        if (err.name === 'ValidationError') {
            return res
                .status(400)
                .json({ 
                    message: 'Validation failed', 
                    errors: Object.values(err.errors).map(e => e.message)
                });
        }
        return res
            .status(400)
            .json({ message: 'Failed to add trip', error: err.message });
    }
};

    // PUT: /trips/:tripCode - Adds a new Trip
    // Regardless of outcome, response must include HTML status code
    // and JSON message to the requesting client
    const tripsUpdateTrip = async(req, res) => {
    try {
        const q = await Model
            .findOneAndUpdate(
                { 'code': req.params.tripCode },
                {
                    code: req.body.code,
                    name: req.body.name,
                    length: req.body.length,
                    start: req.body.start,
                    resort: req.body.resort,
                    perPerson: req.body.perPerson,
                    image: req.body.image,
                    description: req.body.description
                },
                { 
                    new: true,           // Return the updated document
                    runValidators: true  // Important! This runs schema validation on updates
                }
            )
            .exec();

        if (!q) {
            return res
                .status(404)
                .json({ message: 'Trip not found' });
        } else {
            return res
                .status(200)
                .json(q);
        }
    } catch(err) {
        // Mongoose validation errors come through here automatically
        if (err.name === 'ValidationError') {
            return res
                .status(400)
                .json({ 
                    message: 'Validation failed', 
                    errors: Object.values(err.errors).map(e => e.message)
                });
        }
        return res
            .status(500)
            .json({ message: 'Update failed', error: err.message });
    }
};

    // DELETE: /trips/:tripCode - Deletes a trip
    // Regardless of outcome, response must include HTML status code
    // and JSON message to teh requesting client
    const tripsDeleteTrip = async(req, res) => {
        console.log(req.params);
        
        const q = await Model
            .findOneAndDelete({ 'code': req.params.tripCode })
            .exec();

        if(!q) {
            // Database returned no data
            return res
                .status(404)
                .json({message: 'Trip not found' });
        } else { 
            // Return deleted trip
            return res
                .status(200)
                .json(q);
        }
    };



// Adding new search function to controller
// GET: /trips/search?q=searchTerm - searches trips by name, resort, or description
const tripsSearch = async(req, res) => {
    const searchTerm = req.query.q;
    
    if (!searchTerm) {
        // If no search term, return all trips
        return tripsList(req, res);
    }

    // Sanitize and validate search term
    if (typeof searchTerm !== 'string' || searchTerm.length > 100) {
        return res
            .status(400)
            .json({ message: 'Invalid search term'});
    }

    const sanitizedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');


    try {
        // Use regex for case-insensitive partial matching
        // The indexes on 'name' and 'code' will help optimize these queries
        const q = await Model
            .find({
                $or: [
                    { name: { $regex: sanitizedTerm, $options: 'i' } },
                    { resort: { $regex: sanitizedTerm, $options: 'i' } },
                    { description: { $regex: sanitizedTerm, $options: 'i' } },
                    { code: { $regex: sanitizedTerm, $options: 'i' } }
                ]
            })
            .exec();

        if (!q || q.length === 0) {
            return res
                .status(404)
                .json({ message: 'No trips found matching your search' });
        } else {
            return res
                .status(200)
                .json(q);
        }
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Search error', error: err.message });
    }
};


module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip,
    tripsDeleteTrip,
    tripsSearch
};
