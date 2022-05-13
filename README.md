OAuth Backend Example
--

1. Create an account using `prvd`
2. Create an OAuth application in Ident with the following payload:

```
{
  "name": "Opschain",
  "config": {
    "oauth": {
      "name": "OpsChain",
      "authorize_uri": "http://localhost:3000/oauth/authorize",
      "callback_uri": "http://localhost:3000/oauth/callback",
      "client_secret": "x3ThI1Hl1tgagWjC08ONbKkygR9dcghpuszchU2JEOl1uU6o",
      "branding": {
        "authorize_logo_href": "https://assets.ey.com/content/dam/ey-sites/ey-com-demo/en_gl/generic/logos/EY-white-logo.png"
      }
    }
  }
}
```
