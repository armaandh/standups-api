/**
 * GET /members
 *
 * Returns a collection of ALL members.
 * @returns {Array.Object}
 */
module.exports.handler = (event, context, callback) => {
    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        body: JSON.stringify({
            members: [{
                id: 2,
                name: 'James',
                address: 'james@mail.com',
            }, {
                id: 3,
                name: 'Jimmy',
                address: 'jimmy@mail.com',
            }, ],
        }),
    };

    callback(null, response);
};