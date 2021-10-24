const jwt = require("jsonwebtoken");

//middleware function to check token
//adding verify to any route will call this
const verify = function(req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("access denied");

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    //this allows us access to the information used to encode token via req.user
    //eg user id, user name, etc
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
}


module.exports = verify
