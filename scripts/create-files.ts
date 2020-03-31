import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { ENCODING } from './generate';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const rmDir = promisify(fs.rmdir);
const readDir = promisify(fs.readdir);
const mkDir = promisify(fs.mkdir);

/**
 * Create package.json if not exists
 * @param packageDir
 * @param packageName
 */
export async function checkOrCreatePackageJson(
    packageDir: string,
    packageName: string
) {
    try {
        await readFile(`${packageDir}/package.json`, ENCODING);
    } catch (err) {
        let packageJson = await readFile(
            path.resolve(__dirname, '../templates/package.json.template'),
            ENCODING
        );

        packageJson = packageJson.replace('{{package-name}}', packageName);

        await writeFile(`${packageDir}/package.json`, packageJson);
    }
}

export async function checkOrCreateFiles(
    packageDir: string,
    srcPackageDir: string,
    packageName: string
) {
    try {
        await readDir(packageDir, ENCODING);

        await checkOrCreatePackageJson(packageDir, packageName);

        try {
            await readDir(srcPackageDir, ENCODING);
            await rmDir(srcPackageDir, { recursive: true });
            await mkDir(srcPackageDir);
        } catch (err) {
            await mkDir(srcPackageDir);
        }
    } catch (err) {
        await mkDir(packageDir);
        await mkDir(srcPackageDir);
        await checkOrCreatePackageJson(packageDir, packageName);
    }
}

export async function createIndexImportFile(
    componentNames: string[],
    srcPackageDir: string
) {
    const fileContent = componentNames.reduce((acc, componentName) => {
        acc += `export * from './${componentName}';\n`;

        return acc;
    }, '');

    await writeFile(path.join(srcPackageDir, 'index.tsx'), fileContent);
}
