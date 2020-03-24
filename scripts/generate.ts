import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { createComponent } from './create-component';
import { checkOrCreateFiles } from './create-files';

export const ENCODING = 'utf-8';

const rootIconsDir = path.resolve(
    __dirname,
    '../node_modules/alfa-ui-primitives/icons'
);

const srcDir = path.resolve(__dirname, '../packages');

const readDir = promisify(fs.readdir);
const mkDir = promisify(fs.mkdir);

const EXCLUDED_CATEGORIES = ['purgatory'];

interface Icon {
    name: string;
    variants: Set<string>;
}

interface Icons {
    [key: string]: Icon[]; // key is package name
}

export const SVG_EXT = 'svg';

const icons: Icons = {};

const PACKAGE_ALIAS = {
    icon: 'classic',
};

const getPackageName = (iconPrefix: string) =>
    PACKAGE_ALIAS[iconPrefix] || iconPrefix;

function generateIcon(iconName: string, dir: string) {
    const re = new RegExp(`.${SVG_EXT}$`);

    const [iconPrefix, name] = iconName.replace(re, '').split('_');

    const packageName = getPackageName(iconPrefix);

    if (!icons[packageName]) {
        icons[packageName] = [];
    }

    const index = icons[packageName].findIndex(icon => icon.name === name);

    if (index === -1) {
        icons[packageName].push({
            name,
            variants: new Set([path.join(dir, iconName)]),
        });
    } else {
        icons[packageName][index].variants.add(path.join(dir, iconName));
    }
}

async function processDir(dir: string) {
    return readDir(dir, ENCODING).then(iconNames => {
        iconNames
            .filter(iconName => path.extname(iconName) === `.${SVG_EXT}`)
            .forEach(iconName => {
                generateIcon(iconName, dir);
            });
    });
}

async function generateIconsTree(categories: string[]) {
    await Promise.all(categories.map(processDir));
}

async function createPackage(packageName: string) {
    const packageDir = path.join(srcDir, packageName);
    const srcPackageDir = path.join(packageDir, 'src');

    await checkOrCreateFiles(packageDir, srcPackageDir, packageName);

    const iconVariants = icons[packageName].reduce(
        (acc, icon) => [...acc, ...icon.variants],
        []
    );

    await Promise.all(
        iconVariants.map(filePath => createComponent(filePath, srcPackageDir))
    );
}

async function generateComponents() {
    await Promise.all(Object.keys(icons).map(createPackage));
}

async function main() {
    let categories = await readDir(rootIconsDir, ENCODING);

    categories = categories
        .filter(dir => !EXCLUDED_CATEGORIES.includes(dir))
        .map(dir => path.join(rootIconsDir, dir));

    await generateIconsTree(categories);

    try {
        await readDir(srcDir, ENCODING);
    } catch (err) {
        await mkDir(srcDir);
    }

    await generateComponents();
}

main();
