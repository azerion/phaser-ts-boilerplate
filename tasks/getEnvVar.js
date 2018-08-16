module.exports = function getEnvVar(key, value) {
    return ((data) => {
        let tmp = data.find((element) => {
            return element.indexOf(key) !== -1;
        });

        if (typeof(tmp) !== 'undefined') {
            return tmp.substr(tmp.indexOf(key + '=') + key.length + 1);
        }

        return value;
    })(process.argv);
};