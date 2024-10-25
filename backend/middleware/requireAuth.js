const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: "Authorization token is missing!" });
    }

    const token = authorization.split(' ')[1];

    try {
        const { id } = jwt.verify(token, process.env.SUPER_SECRET);

        req.user = await User.findOne({ id }).select("_id");
        next();
    } catch (error) {
        console.log("authorizing request failed! ", error);
        res.status(401).json({ error: "Unauthorized request!"});
    }
};

module.exports = requireAuth;
