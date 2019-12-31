
# Synthetic Monitoring

Mood's repository includes a suite of synthetic-monitoring to check the site works as expected.

### Browser Tests

#### Sign-in

- page includes expected selectors
- login response contained expected fields and headers
- login request contained expected fields and headers
- login with valid-credentials succeeds at navigating to the main page
- clicking register link redirects to that page

#### Register

- page includes expected selectors
- clicking sign in link redirects to that page

#### Main Page

#### Privacy

#### Edit

---

### API Tests

#### `DELETE api/mood`

- requires authentication
- rejects invalid cookies
- returns the expected status-code and body when authenticated

#### `GET api/metadata`

- returns the expected status-code and body without authentication

#### `GET api/mood`

- requires authentication
- rejects invalid cookies
- returns the expected body formats and headers when authenticated
- returns the expected data-sets when authenticated

#### `PATCH api/mood`

- requires authentication
- rejects invalid cookies
- returns the expected status-code, body formats and headers when authenticated

#### `POST api/login`

- returns the expected status-code
- returns the expected status-code, body format, and headers when authenticated

## ➡️ Continuous Integration

Mood's CI pipeline is implemented using Github Actions.

- Detect the current website version
- Deploy mood
- Detect the new website version
- Run synthetic tests
