module.exports = {
    plugins: [autoprefixer({
        browsers: ['last 2 versions', 'Android >= 4.0', 'iOS 7'],
        remove: true,
    })]
}