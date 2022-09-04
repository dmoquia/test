const jwt = require("jsonwebtoken");
// what it does is to decode to verify if the token contains the user information such id
module.exports = async (req, res, next) => {
  try {
    // para saan to split(" ")[1] kung titingnan mo sa Home.js yung Authorization: "Bearer " na may space para dito yan
    const token = req.headers["authorization"].split(" ")[1];
    // const token = req.headers.authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Auth failed", success: false });
      } else {
        req.body.userId = decoded.id;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(401).send({ message: "Auth Failed", success: false });
  }
};
