module.exports = () => {
    process.env.TILE38_URI =
        process.env.TILE38_URI || 'redis://localhost:9851/';
};
