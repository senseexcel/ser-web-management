const ZipService   = require('./create-zip.service');
const copyFileSync = require('fs').copyFileSync;
const deleteFile   = require('fs').unlinkSync;
const fileExists   = require('fs').existsSync;
const resolve      = require('path').resolve;

/**
 * bundle all generated files into one file and put them into ./dist/qlik-extension/<<EXTENSION_NAME>>.js
 * create qext and wbfolder file
 *
 * @class CreateExtensionPlugin
 */
class CreateMashup {

    constructor() {
        this.zipService = ZipService.getInstance();
    }

    /** simply copy .qext, .wbl file */
    moveFiles() {
        const sourceDir = resolve(process.cwd(), './dist/serWebManagement/assets');
        const targetDir = resolve(process.cwd(), './dist/serWebManagement');

        ['wbfolder.wbl', 'ser-web-management.qext'].forEach((file) => {
            const filePath = resolve(sourceDir, file);
            if (fileExists(filePath)) {
                copyFileSync(filePath, resolve(targetDir, file));
                deleteFile(filePath);
            }
        });
    }

    async run() {
        /** copy files */
        this.moveFiles();
        /** create zip file */
        await this.zipService.createZipFile();
    };
}

const createMashup = new CreateMashup();
createMashup.run().then(() => {
    process.stdout.write("Mashup ser-web-managment created.");
    process.stdout.write("You can find it under ./dist/ser-web-management.zip");
});
