const express = require('express')
const app = express()
const port = 3000

const { Ident, identClientFactory, vaultClientFactory } = require('provide-js')

const apiAccessToken = process.env['PRVD_API_ACCESS_TOKEN']
const oauthClientId = process.env['PRVD_OAUTH_CLIENT_ID']
const oauthClientSecret = process.env['PRVD_OAUTH_CLIENT_SECRET']

var oauthApplication // this is the Opschain OAuth application

// fetch the OAuth application details from Ident...
const fetchApplication = async () => {
  return Ident.fetchOAuthApplicationDetails(oauthClientId)
}

// sign on behalf of the authorized user...
const sign = async (accessToken, message) => {
  // FIXME-- parse access token... read vault and key ids from scope...
  var vaultId
  var keyId
  const vault = vaultClientFactory(accessToken)
  return vault.signMessage(vaultId, keyId, message)
}

app.get('/oauth/authorize', (req, res) => {
  res.redirect(302, `${oauthApplication.authorizeUri}?response_type=code`
                                                  + `&client_id=${oauthClientId}`
                                                  + `&redirect_uri=${oauthApplication.callbackUri}`
                                                  + `&scope=${req.query?.scope}`
                                                  + `&state=${req.query?.state}`
                                                  + `&code_challenge=${req.query?.code_challenge}`
                                                  + `&code_challenge_method=${req.query?.code_challenge_method}`
  )
})

app.get('/oauth/callback', async (req, res) => {
  const ident = identClientFactory(apiAccessToken)
  try {
    const token = await ident.createToken({
      client_id: oauthClientId,
      client_secret: oauthClientSecret,
      code: req.query?.code,
      code_verifier: req.query?.code_verifier,
      grant_type: req.query?.grant_type,
      redirect_uri: req.query?.redirect_uri,
      scope: req.query?.scope,
      state: req.query?.state,
    })

    // const raw = JSON.stringify(token, null, 2)
    res.status(201).json({
      access_token: token.accessToken,
      refresh_token: token.refreshToken,
      expires_in: token.expiresIn,
      scope: token.scope,
      state: token.state,
      token_type: 'bearer',
    })
  } catch (e) {
    res.status(400)
  }
})

app.post('/sign', async (req, res) => {
  // FIXME-- read message to sign from state param...
  // const resp = await sign(token.accessToken, 'hello')
  // res.status(201).send(JSON.stringify(resp))
  res.status(501)
})

setTimeout(async () => {
  oauthApplication = await fetchApplication()
}, 10)

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
