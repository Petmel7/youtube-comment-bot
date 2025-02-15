const { getComments, replyToComment } = require('./services/youtube');
const { generateResponse } = require('./services/geminiai');

(async () => {
    const comments = await getComments();
    for (const comment of comments) {
        const responseText = await generateResponse(comment.text);
        await replyToComment(comment.id, responseText);
    }
})();