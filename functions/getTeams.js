/**
 * GET /teams
 *
 * Returns a collection of ALL teams.
 * @returns {Array.Object}
 */
module.exports.handler = (event, context, callback) => {
    console.log('getTeams');
    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        body: {
            teams: [{
                    id: '1',
                    name: 'Engineering',
                    members: [{
                            id: '11',
                            name: 'Edgar Zapeka'
                        },
                        {
                            id: '22',
                            name: 'Cha Tumtaweetikul'
                        },
                        {
                            id: '33',
                            name: 'Armaan Dhanji'
                        },
                        {
                            id: '44',
                            name: 'Liam MacNeil'
                        }
                    ],
                    subteams: [{
                            id: '2',
                            name: 'Design',
                            members: [{
                                    id: '55',
                                    name: 'Steve Jobs'
                                },
                                {
                                    id: '66',
                                    name: 'Jony Ive'
                                },
                            ],
                            subteams: []
                        },
                        {
                            id: '3',
                            name: 'Management',
                            members: [{
                                id: '77',
                                name: 'Jeff Bezos'
                            }, ],
                            subteams: []
                        }
                    ]
                },
                {
                    id: '2',
                    name: 'Design',
                    members: [{
                            id: '55',
                            name: 'Steve Jobs'
                        },
                        {
                            id: '66',
                            name: 'Jony Ive'
                        },
                    ],
                    subteams: []
                },
                {
                    id: '3',
                    name: 'Management',
                    members: [{
                        id: '77',
                        name: 'Jeff Bezos'
                    }, ],
                    subteams: []
                },
            ]
        },
    };

    callback(null, response);
};