const express = require('express');
const app = express();
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
const jwtAuthz = require('express-jwt-authz')

var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    // this endpoint provide the public key
    jwksUri: 'https://dev-mda53ujl.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'http://localhost:8000',
  // accept the token issued by this issuer
  issuer: 'https://dev-mda53ujl.us.auth0.com/',
  algorithms: ['RS256']
});

const checkPermission = jwtAuthz(["read:messages"], {
  customScopeKey: "permissions"
})

app.get('/public', (req,res) => {
  res.json({
    type: "public"
  })
})

app.get('/private', jwtCheck, (req, res) => {
  res.json({
    type: "private"
  })
})

app.get('/role', jwtCheck, checkPermission, (req, res) => {
  res.json({
    type: "Role base authentication success"
  })
})

app.listen(process.env.PORT || 8000)