const jwt = require('jsonwebtoken')
exports.authMiddleware = async(req, res, next) => {

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            const token = req.headers.authorization.split(" ")[1];

            // decode token 
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decoded
            next()
        } catch (error) {
            console.log(error)
        }
    }
}
