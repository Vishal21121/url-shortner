# URL Shortener

This is a simple URL shortening service built using React.js, Tailwind css, Node.js, Express.js and MongoDB. The project allows you to create shortened URLs that redirect to the original URL when accessed.

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

### Install the dependencies:

- Client depenedencies:

```bash
cd client
```
```bash
npm install
```
- Server depenedencies:

```bash
cd server
```
```bash
npm install
```

#### Start the server:

- Client side

```bash
npm run dev
```

- Server side

```bash
npm start
```
Now, the server should be running at `http://localhost:8080`.
