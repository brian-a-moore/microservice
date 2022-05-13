// Dependencies
const axios = require('axios');
const url = require('url');
const CircuitBreaker = require('../lib/CircuitBreaker');

const circuitBreaker = new CircuitBreaker();

// Post Service
class PostService {
    constructor({ serviceRegistryUrl, serviceVersion }) {
        this.serviceRegistryUrl = serviceRegistryUrl;
        this.serviceVersion = serviceVersion;
    };

    async getPosts() {
        const { ip, port } = await this.getService('post-service');

        return this.callService({
            method: 'GET',
            url: `http://${ip}:${port}/posts`
        });
    };

    async getPost(id) {
        const { ip, port } = await this.getService('post-service');
        
        return this.callService({
            method: 'GET',
            url: `http://${ip}:${port}/post/${id}`
        });
    };

    async createPost(data) {
        const { ip, port } = await this.getService('post-service');
        
        const id = await this.callService({
            method: 'POST',
            url: `http://${ip}:${port}/post`,
            data
        });

        return id;
    };

    async deletePost(id) {
        const { ip, port } = await this.getService('post-service');
        
        return this.callService({
            method: 'DELETE',
            url: `http://${ip}:${port}/post/${id}`
        });

    };

    async getService(serviceName) {
        const res = await axios.get(`${this.serviceRegistryUrl}/retrieve/${serviceName}/${this.serviceVersion}`);
        return res.data.result.service;
    }

    async callService(opts) {
        return circuitBreaker.callService(opts);
    }
};

module.exports = PostService;