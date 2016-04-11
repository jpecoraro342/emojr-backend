module.exports = {
    "port": process.env.PORT || 3000,
    // "postgres_url": "postgres://localhost/emojr",
    "postgres_url": "ppostgres://tnlvnlppvozawg:29kBksgBhXosbCOdMvFiBP3alD@ec2-54-163-254-231.compute-1.amazonaws.com:5432/df2o769m78f92",
    "sessionCookie": {
        "maxAge": 8640000,
        "httpOnly": true,
        "secure": false
    },
    "sessionSecret": process.env.SESSION_SECRET || "TestTest",
    "sessionKey": 'sessionId',
    "sessionCollection": 'sessions'
};
