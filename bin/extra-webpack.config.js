const ngCommands = {
    NG_BUILD: 'build',
    NG_SERVE: 'serve'
}
const ngCommand = process.argv[2];

const ifDefOptions = {
    mode: "qmc",
    "ifdef-verbose": true
};

console.log(ngCommand);
console.log(ngCommands.NG_SERVE);

switch ( ngCommand ) {
    case ngCommands.NG_SERVE:
        ifDefOptions.mode = "development";
        break;
    default:
        ifDefOptions.mode = "qmc";
}

/** webpack configuration which should used for angular cli*/
module.exports = {

    module: {
        rules: [{ 
            test: /\.tsx?$/,
            use: [
                {loader: "ifdef-loader", options: ifDefOptions},
                {loader: '@ngtools/webpack'},
            ]
        }]
    },

    node: {
        crypto: true,
        stream: true
    }
}
