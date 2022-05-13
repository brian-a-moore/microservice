class PostService {
    constructor() {
        this.posts = [];
    }

    getAll() {
        const posts = this.posts;
        return posts;
    };

    getById(id) {
        const post = posts.find(post => post.id === id);
        return post;
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