class PostService {
    constructor() {
        this.posts = [];
    }

    getAll() {
        return this.posts;
    };

    getById(id) {
        return this.posts.find(post => post.id === id);
    };

    create(title, body, name) {
        const id = Math.random().toString();

        this.posts.push({
            id,
            title,
            body,
            name
        });

        return id;
    };

    delete(id) {
        this.posts = this.posts.filter(post => post.id !== id);
    };
};

module.exports = PostService;