# Microservice

This repo is an example microservice architecture created with node.js and express.js. The general purpose here is just to get some practical experience writing, registering and deregistering versioned services with a service registry and using that registry with API server to successfully respond to client requests by retrieving data from each microservice. To protect the microservice and offer some resilience, I am using a circuit breaker in the API server.  I am also auto cleaning up unusued and/or offline services.


In this example repo, a user should start the API Server and Service Registry first, then start the services. A user can perform various crud operations on "posts" and associated "comments" that are kept in memory while the app is running. 

FUTURE PLANS:
- Add some type of authentication
- Add some route schema validation with joi
- Add some caching with Redis
- Add a PostgreSQL or MongoDB backend to store the services data
