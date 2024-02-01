# URL Shortener

This is a simple URL shortening service built using Node.js and MongoDB. The project allows you to create shortened URLs that redirect to the original URL when accessed.

## Features

- Generate shortened URLs
- Redirect to original URL when shortened URL is accessed
- Store URL mappings in MongoDB

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development purposes.

### Prerequisites

Make sure you have Node.js and MongoDB installed on your machine.

```bash
node -v
mongo --version
```

### Installing

Clone the repository:

```bash
git clone https://github.com/Vishal21121/url-shortner.git
cd url-shortner
```

Install the dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

Now, the server should be running at `http://localhost:8080`.

## Built With

- [Node.js](https://nodejs.org/) - JavaScript runtime built on Chrome's V8 JavaScript engine
- [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
- [MongoDB](https://www.mongodb.com/) - Source-available cross-platform document-oriented database program
