
# mood.

![example screenshot](screenshot.png "Example Screenshot")

"mood." is a simple progressive webapp I'm building to learn a few aspects of web development.

- Hosted on Zeit.co
- Responsive stylesheets built with modern CSS

## Features

- Stores mood over time in an offline-first fashion
- Displays a graph and analytics of mood over time

## Build System
---
### Building
```
build           compile client-side code into 'public' folder using webpack
```

### Deployment
```
deploy          deploy the website and associated apis to Zeit
```

### Running
```
run:api         run the site's apis locally directly
run:client      run the site's static-serve locally directly
dev             run the site using docker-compose
```


## Running Locally

Unfortunately `now dev` doesn't run properly, so to run locally you'll need to run:

```bash
docker-compose up
```

This will set up working APIs and a static-file server.

### `.env` file

Environment secrets are stored in a `.env` file with the following fields:

```
# -- google signin client id
GOOGLE_CLIENT_ID=xxx

# -- encryption key for application data
ENCRYPTION_KEY=xxx

# -- private key for google signin
GOOGLE_PRIVATE_KEY=xxx

# -- limited-access basic-auth credentials for synthetic monitoring
TEST_ACCOUNT_CREDENTIAL=xxx
```

## License

Copyright (c) 2019 Róisín Grannell

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
