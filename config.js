exports.DATABASE_URL = process.env.DATABASE_URL ||
    global.DATABASE_URL ||
    (process.env.NODE_ENV === 'production' ?
        'mongodb://mkuehn10:mkuehn10@ds145245.mlab.com:45245/mkuehn10' :
        'mongodb://localhost/shopping-list-dev');
exports.PORT = process.env.PORT || 8080;