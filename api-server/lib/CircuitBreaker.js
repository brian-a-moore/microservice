// Dependencies
const axios = require('axios');
const { CIRCUIT_STATES, LOG_TYPES } = require('../config/enum');
const logger = require('../utils/logger');

// Circuit Breaker
class CircuitBreaker {
    constructor() {
        this.states = {};
        this.failureThreshold = 5;
        this.cooldown = 10;
        this.timeout = 2;
    };

    // Service Call
    async callService(opts) {
        const endpoint = `${opts.method}:${opts.url}`;

        if(!this.canRequest(endpoint)) return false;

        opts.timeout = this.timeout * 1000;

        try {
            const res = await axios(opts);
            this.onSuccess(endpoint);
            return res.data;
        } catch(e) {
            this.onFailure(endpoint);
            return false;
        }
    }

    // Endpoint success
    onSuccess(endpoint) {
        this.init(endpoint);
    }

    // Endpoint failure
    onFailure(endpoint) {
        const state = this.states[endpoint];
        state.failures += 1;

        if(state.failures > this.failureThreshold) {
            state.circuit = CIRCUIT_STATES.OPEN;
            state.nextTry = new Date() / 1000 + this.cooldown;

            logger({
                type: LOG_TYPES.WARNING.type,
                message: `${endpoint} circuit state set to "OPEN"`
            });
        }
    }

    // Check if the endpoint can be requested
    canRequest(endpoint) {
        if(!this.states[endpoint]) this.init(endpoint);

        const state = this.states[endpoint];

        if(state.circuit === CIRCUIT_STATES.CLOSED) return true;

        const now = new Date() / 1000;

        if(state.nextTry <= now) {
            state.circuit = CIRCUIT_STATES.HALF;
            return true;
        };

        return false;
    }

    // Initialize the endpoint
    init(endpoint) {
        this.states[endpoint] = {
            failures: 0,
            cooldown: this.cooldown,
            circuit: CIRCUIT_STATES.CLOSED,
            nextTry: 0
        };
    }
};

module.exports = CircuitBreaker;