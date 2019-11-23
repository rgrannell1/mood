
# 😐 mood.

Badge | Status
----- | ------
License | MIT

![example screenshot](screenshot.png "Example Screenshot")

"mood." is a simple progressive webapp I'm building to learn a few aspects of web development.

- Hosted on Zeit.co
- Responsive stylesheets built with modern CSS
- Locally testable with `docker-compose`

## Features

- Stores mood over time in an offline-first fashion
- Displays a graph and analytics of mood over time

## Files

```
api/               routes exposed under the path <host>/api/*
build/commands/    build commands build to `pulpfile.mjs`
client/            miscelleneous client-side code
monitoring/        synthetic monitoring used to check the code works as expected
public/            built client-code
routes/            code implementing each api route exposed in api/
```

## Build System

Environment secrets are stored in a `.env` file with the following fields:

```
AUTH0_CLIENT_ID
AUTH0_CLIENT_SECRET
AUTH0_DOMAIN
COOKIE_KEY
ENCRYPTION_KEY
GOOGLE_CLIENT_ID
GOOGLE_PRIVATE_KEY
TEST_ACCOUNT_CREDENTIAL
```

The following commands are supported as npm scripts:

### Building
```
build          compile client-side code and create a `public` directory
build:watch    watch for changes in `client` code and run `build` on change
clean          delete the `public` directory
```

### Running
```
live-reload    use live-reload to run live-reloading static-code locally
run:api         run the site's apis locally directly
run:client      run the site's static-serve locally directly
dev             run the site using docker-compose & watch for file-changes
```

### Deployment
```
deploy          deploy the website and associated apis to Zeit
```
