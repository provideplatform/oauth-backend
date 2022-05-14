
# OAuth Backend Example

This example project demonstrates how to leverage the [Provide](https://docs.provide.services) OAuth provider to allow users to delegate single-use API authorizations (e.g., bearer access tokens), to your product or platform, which can then be used to call, e.g., the [Vault](https://docs.provide.services/api/vault) asymmetric signing API. Authorization is restricted to the requested and authorized scopes per RFC 6749.

Various [Ident](https://docs.provide.services/api/ident) and Vault APIs are used as part of this example. The [provide-js](https://github.com/provideplatform/provide-js) package is included in `package.json` and is used by various Express endpoints.

## Service Quickstart

Quickly build and run the OAuth backend example project:

1. Install package dependencies:
`npm install && npm start`
2.  Start the Express server on port `3000` with required environment variables:
```shell
PRVD_API_ACCESS_TOKEN=<your bearer JWT> \
PRVD_OAUTH_CLIENT_ID=<client_id of your OAuth application; see Ident application id> \
PRVD_OAUTH_CLIENT_SECRET=<client_secret of your OAuth application; see Ident application OAuth config> \
npm start
```

**Note:** It is recommended to install and use the [Provide CLI](https://github.com/provideplatform/provide-cli). All examples shown below using `curl` are supported by the `prvd` command.

## OAuth Applications

### Creating OAuth Applications

OAuth applications are supported natively by [Ident](https://docs.provide.services/api/ident). You may create a new `Application` or modify the configuration of one which exists to effectively enable OAuth support for `authorization_code` grants.

To create an OAuth application in Ident, call [this API](https://docs.provide.services/api/rest-api-v1/ident/applications#create-application-1), making sure to first generate the `client_secret` out-of-band:

```shell
curl -v -XPOST -H 'authorization: bearer <your bearer JWT>' \
               -H 'content-type: application/json' \
               https://ident.provide.services/api/v1/applications -d \
'{
  "name": "TxSigner™",
  "config": {
    "oauth": {
      "name": "TxSigner™",
      "authorize_uri": "https://ident.provide.services/api/v1/oauth/authorize",
      "callback_uri": "http://localhost:3000/oauth/callback",
      "client_secret": "<your generated client secret value>",
      "branding": {
        "authorize_logo_href": "https://assets.example.org/images/logo.png"
      }
    }
  }
}'
```

**Note:** For the time being, users of the API must generate the `client_secret` value which their OAuth applications will require when exchanging an authorized `code` for the `access_token` on behalf a consenting user.


### Using the OAuth Application

A single-page frontend client application should redirect the user to the following URL:

```
http://localhost:8090/oauth/authorize?client_id=<OAuth client_id>
                                     &scope=key.0d029b38-d360-11ec-a5ff-0bebd6292833.sign
                                     &grant_type=authorization_code
                                     &redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth%2Fcallback
```

#### [ Insert Swimlane Drawing ]
