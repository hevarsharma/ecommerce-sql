const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
  let userId;

  const authHeader = req.headers['authorization']
  if (authHeader !== undefined) {
    const token = authHeader.split(' ')[1]

    if (token == null) {
      return res.status(401).send({ mesage: ".....unautherized from token side" });
    }

    var decode = jwt.decode(token);

    userId = decode.id;

    jwt.verify(token, 'secret', (err, verifiedJwt) => {
      if (err) {
        res.send({ message: err.message })
      } else {
        console.log('token verify');
        //res.send( {token: token} )
      }

      req.userId = userId

      next()
    })
  }
  else {
    return res.status(401).send({ mesage: "unautherized form header side...." });
  }

}