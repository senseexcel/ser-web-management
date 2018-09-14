const ngCommands = {
    NG_BUILD: 'build',
    NG_SERVE: 'serve'
}
const ngCommand = process.argv.slice(2, 1);

const ifDefOptions = {
    DEV: false
};

switch ( ngCommand ) {

    case ngCommands.NG_SERVE:
        ifDefOptions.DEV = true;
        break;
    default:
        ifDefOptions.DEV = false;
}

/** webpack configuration which should used for angular cli*/
module.exports = {

    module: {
        rules: [{ 
            test: /\.tsx?$/,
            use: [
                {loader: '@ngtools/webpack'},
                {loader: "ifdef-loader", options: ifDefOptions}
            ]
        }]
    },

    node: {
        crypto: true,
        stream: true
    }
}
