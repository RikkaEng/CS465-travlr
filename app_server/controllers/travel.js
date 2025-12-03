const tripsEndpoint = 'http://localhost:3000/api/trips'; // <<-- added
const searchEndpoint = 'http://localhost:3000/api/trips/search';

const options = {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
};

/* GET travel view with optional search */
const travel = async function(req, res, next) {
    const searchTerm = req.query.q || '';
    
    // Determine which endpoint to use
    let endpoint = tripsEndpoint;
    if (searchTerm) {
        endpoint = `${searchEndpoint}?q=${encodeURIComponent(searchTerm)}`;
    }
    
    await fetch(endpoint, options)
        .then(res => res.json())
        .then(json => {
            let message = null;
            if(!(json instanceof Array)) {
                message = 'API lookup error';
                json = [];
            } else {
                if(!json.length){
                    if (searchTerm) {
                        message = `No trips found matching "${searchTerm}"`;
                    } else {
                        message = 'No trips exist in our database!';
                    }
                }
            }
            res.render('travel', {
                title: 'Travlr Getaways', 
                trips: json, 
                message,
                searchTerm  // Pass search term to template
            });
        })
        .catch(err => res.status(500).send(err.message));
};

module.exports = {
    travel
};