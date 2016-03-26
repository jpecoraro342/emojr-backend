module.exports = {
    "port": process.env.SESSION_SECRET || 3000,
    "mongo_url": "mongodb://localhost/emojr",
    "sessionCookie": {
        "maxAge": 8640000,
        "httpOnly": true,
        "secure": false
    },
    "sessionSecret": process.env.SESSION_SECRET || "TestTest",
    "sessionKey": 'sessionId',
    "sessionCollection": 'sessions'
};
