# Microservice

This repo is an example microservice architecture created with node.js and express.js. The general purpose here is just to get some practical experience writing, registering and deregistering versioned services with a service registry and using that registry with API server to successfully respond to client requests by retrieving data from each microservice. To protect the microservice and offer some resilience, I am using a circuit breaker in the API server.  I am also auto cleaning up unusued and/or offline services.

FUTURE PLANS:
- Add some type of authentication
- Add some route schema validation with joi
- Add some caching with Redis

