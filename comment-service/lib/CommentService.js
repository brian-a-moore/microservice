class CommentService {
    constructor() {
        this.comments = [];
    }

    getAll(postId) {
        const comments = this.comments.filter(comment => comment.postId === postId);
        return comments;
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
};

module.exports = CommentService;