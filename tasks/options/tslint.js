module.exports = {
    options: {
        // can be a configuration object or a filepath to tslint.json
        configuration: "./tslint.json"
    },
    dist: {
        src: [
            'ts/**/*.ts'
        ]
    }
};