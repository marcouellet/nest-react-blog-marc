# Build a blog using Nest.js, TypeScript, React and MongoDB

Application repo for a simple blog application built with Nest.js, TypeScript, React and MongoDB.

This project is an enhancement from project https://github.com/yemiwebby/nest-react-project

### Enhancements

Backend:

- Elaborated architecture (repository pattern, config service, role access, session expiration, custom logger, dto validation)
- Added unit tests and e2e tests for full code coverage

Frontend:

- Added access control (register, login, user for posts, administrator section, session expiration )
- Added form validation

## Getting Started
This prototype is divided into two separate sections. Namely the Backend ( Built with Nest.js) and the frontend
( Built with React ).

Install TypeScript globally on your machine if you don't have it installed already:

```bash
npm install -g typescript
```

### Clone the repository
To easily set up the application, clone this repository which contains directory for both sections of the project ( i.e `blog-backend` and `blog-frontend`)

```bash
git clone https://github.com/marcouellet/nest-react-blog-marc.git
```

## Change directory into the newly cloned project
```bash
cd nest-react-blog-marc
```

## Backend
### Change directory into the backend
```bash
cd blog-backend
```

### Install backend dependencies

```bash
npm install
```

### Create .env file
Once the installation process is complete, personnalize the `.env` file:


Ensure that you replace the `YOUR_AUTH0_DOMAIN` and `YOUR_AUTH0_AUDIENCE` placeholder with the appropriate credentials as obtained from your Auth0 dashboard.


### MongoDB
Ensure that you have mongoDB installed on your machine before running the application. I have this fully setup on my mac already.

Start mongoDB:

```bash
sudo mongod
```

### Run the application
Open another terminal and still within the `blog-backend` project directory run the application with:

```bash
npm run start:dev
```

This will start the backend application on port `5000`. This was modified to avoid confliction with the frontend application which by default will run on port `3000`


## Frontend
Open another terminal from the `nest-react-blog-marc` and navigate to the `blog-frontend-axios` folder to setup the frontend

### Frontend dependencies
```bash
cd blog-frontend
npm install
```

### Run the frontend app

```bash
npm start
```

### Personnalize the `.env` file for your own setup.
### Test the application
Finally open your browser and view the application on http://localhost:3000
## Prerequisites
 [Node.js](https://nodejs.org/en/), [Yarn package manager](https://yarnpkg.com/lang/en/docs/install/#mac-stable), [MongoDB](https://docs.mongodb.com/v3.2/installation/) and [TypeScript](https://www.typescriptlang.org/)

### Unit Testing

First, personnalize the .env files in test/environment folder.

You then can run the test in two ways:

a) npm test (or npm test:cov for testing code coverage) 
b) In Visual Studio Code, go to debug section and run 'Debug Backend Jest Tests'

### Integrated Testing

First, personnalize the .env file in test-e2e folder.

You then can run the test in two ways:

a) npm run test:e2e
b) In Visual Studio Code, go to debug section and run 'Debug Backend Jest E2E Tests'

## Built With
[Nest.js]()
[React.js]()
[Passport.js]()
[Auth0]() 
[TypeScript]()
[MongoDB]() 
