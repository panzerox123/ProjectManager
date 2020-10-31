const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req,res,next) => {
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    if(!token) return res.status(401).send("Unauthorised");
    try{
        const decoded = jwt.verify(token,config.get("private_key"));
        req.user = decoded;
        next();
    } catch {
        res.status(401).send("Invalid token");
    }
}