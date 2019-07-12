const resolve = require('path').resolve;
const fs = require('fs');
const JsZip = require('jszip');
const path = require('path');

class CreateZipService {

    constructor() {
        this.rootDirectory = process.cwd();
        this.outDirectory  = resolve(process.cwd(), 'dist');
        const {version}    = JSON.parse(fs.readFileSync(resolve(process.cwd(), 'package.json'), {encoding: 'utf8'}));
        this.version       = version;
    }

    /** create zip file for extension */
    async createZipFile() {

        // we know what directory we want
        const sourceDir = resolve(this.rootDirectory, 'dist', 'serWebManagement');

        let zip = new JsZip();
        this.buildZipFromDirectory(sourceDir, zip, sourceDir);

        /** generate zip file content */
        const zipContent = await zip.generateAsync({
            type: 'nodebuffer',
            comment: 'ser-web-manangement',
            compression: "DEFLATE",
            compressionOptions: {
                level: 9
            }
        });

        /** create zip file */
        fs.writeFileSync(resolve(this.outDirectory, `ser-web-management_${this.version}_.zip`), zipContent);
    }

    // returns a flat array of absolute paths of all files recursively contained in the dir
    buildZipFromDirectory(dir, zip, root) {
        const list = fs.readdirSync(dir);

        for (let file of list) {
            file = path.resolve(dir, file)
            let stat = fs.statSync(file)
            if (stat && stat.isDirectory()) {
                this.buildZipFromDirectory(file, zip, root)
            } else {
                const filedata = fs.readFileSync(file);
                zip.file(path.relative(root, file), filedata);
            }
        }
    }
}

let instance;
module.exports = {
    getInstance: () => {
        if (!instance) {
            instance = new CreateZipService();
        }
        return instance;
    }
}
