```
Hey There! 🙌
```

The Software House - Node.js Developer recruitment task

- This task is built using [Express.js](https://expressjs.com/) web framework, and is using [Typescript Lang](https://www.typescriptlang.org/) for writing the app's logic.

# Contents

- [Install, Configure & Run](#install-configure--run)
- [List of Routes](#list-of-routes)
- [Comments and Assumptions](#comments-and-assumptions)

# Install, Configure & Run

Below mentioned are the steps to install, configure & run in your platform/distributions.

```bash
# Clone the repo.
git clone https://github.com/karolinadebowska/TSH.git
# Goto the cloned project folder.
cd TSH
```

```bash
# Install NPM dependencies.
npm install

# Build the app
npm run build

# Run the app
npm start

# Run tests
npm test
```

# List of Routes

```sh
# Api Routes:

+--------+-------------------------+
  Method | URI
+--------+-------------------------+
  GET    | /movies
  POST   | /movies/add
+--------+-------------------------+

```

# Comments and Assumptions

1. Route GET /movies accept optional query string

- duration
- an array of genres
  e.g. /movies?duration=100&genres=comedy%2Cfantasy%2Ccrime

a. ANY GENRE PROVIDED IN A QUERY STRING THAT DON'T MATCH ACCEPTABLE GENRES IS DELETED FROM THE LIST
e.g., ["Comedy", "fantasy", "Romantic"] => ["Comedy", "Fantasy"]

b. In the task specification, it is said that the endpoint should also return movies with genres saved in lower case. This is not part of my implementation as it's only possible to add movie with "only predefined ones from db file". The assumption is that movie can be created if and only if all genres can be found in predefined values (case sensitie).
