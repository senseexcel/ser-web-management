const ngCommand = process.argv[2];

/** export modified webpack config */
module.exports = (config) => {

    // add custom plugins
    config.plugins = [
        ...config.plugins
    ];

    return config;
};
