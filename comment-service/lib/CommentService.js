class CommentService {
    constructor() {
        this.comments = [];
    }

    getAll(postId) {
        return this.comments.filter(comment => comment.postId === postId);
    };

    create(comment, name, postId) {
        const id = Math.random().toString();
        this.comments.push({
            id,
            comment,
            name,
            postId
        });

        return id;
    };

    delete(id) {
        this.comments = this.comments.filter(comment => comment.id !== id);
    };

    deleteAll(postId) {
        this.comments = this.comments.filter(comment => comment.postId !== postId);
    };
};

module.exports = CommentService;