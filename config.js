module.exports = {
    "port": process.env.PORT || 3000,
    "mongo_url": "mongodb://testuser:test@ds025379.mlab.com:25379/emojr",
    "sessionCookie": {
        "maxAge": 8640000,
        "httpOnly": true,
        "secure": false
    },
    "sessionSecret": process.env.SESSION_SECRET || "TestTest",
    "sessionKey": 'sessionId',
    "sessionCollection": 'sessions'
};
