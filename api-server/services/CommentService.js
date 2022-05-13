// Dependencies
const axios = require('axios');
const url = require('url');
const CircuitBreaker = require('../lib/CircuitBreaker');

const circuitBreaker = new CircuitBreaker();

// Comment Service
class CommentService {
    constructor({ serviceRegistryUrl, serviceVersion }) {
        this.serviceRegistryUrl = serviceRegistryUrl;
        this.serviceVersion = serviceVersion;
    };

    async getComments(postId) {
        const { ip, port } = await this.getService('comment-service');

        return this.callService({
            method: 'GET',
            url: `http://${ip}:${port}/comments/${postId}`
        });
    };

    async createComment(data) {
        const { ip, port } = await this.getService('comment-service');
        
        const id = await this.callService({
            method: 'POST',
            url: `http://${ip}:${port}/comment`,
            data
        });

        return id;
    };

    async deleteComment(id) {
        const { ip, port } = await this.getService('comment-service');
        
        return this.callService({
            method: 'DELETE',
            url: `http://${ip}:${port}/comment/${id}`
        });

    };

    async deleteComments(postId) {
        const { ip, port } = await this.getService('comment-service');
        
        return this.callService({
            method: 'DELETE',
            url: `http://${ip}:${port}/comments/${postId}`
        });
    }

    async getService(serviceName) {
        const res = await axios.get(`${this.serviceRegistryUrl}/retrieve/${serviceName}/${this.serviceVersion}`);
        return res.data.result.service;
    }

    async callService(opts) {
        return circuitBreaker.callService(opts);
    }
};

module.exports = CommentService;