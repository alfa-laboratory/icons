import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { createComponent } from './create-component';

export const ENCODING = 'utf-8';

const rootIconsDir = path.resolve(
    __dirname,
    '../node_modules/alfa-ui-primitives/icons'
);

const srcDir = path.resolve(__dirname, '../packages');

const readDir = promisify(fs.readdir);
const mkDir = promisify(fs.mkdir);

interface Icon {
    name: string;
    variants: Set<string>;
}

interface Icons {
    [key: string]: Icon[]; // key is package name
}

export const SVG_EXT = 'svg';

let icons: Icons = {};

function generateIcon(iconName: string, dir: string) {
    const re = new RegExp(`\.${SVG_EXT}$`);

    const [packageName, name] = iconName.replace(re, '').split('_');

    if (!icons[packageName]) {
        icons[packageName] = [];
    }

    let index = icons[packageName].findIndex(icon => icon.name === name);

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

async function createPackage(packageName: string): Promise<any> {
    const packageDir = path.join(srcDir, packageName);

    try {
        await readDir(packageDir, ENCODING);
    } catch (err) {
        await mkDir(packageDir);
    }

    const iconVariants = icons[packageName].reduce(
        (acc, icon) => [...acc, ...icon.variants],
        []
    );

    await Promise.all(
        iconVariants.map(path => createComponent(path, packageDir))
    );
}

async function generateComponents() {
    await Promise.all(Object.keys(icons).map(createPackage));
}

async function main() {
    console.info('reading directories');

    let categories = await readDir(rootIconsDir, ENCODING);

    categories = categories.map(dir => path.join(rootIconsDir, dir));

    console.info('generate icons tree');

    await generateIconsTree(categories);

    try {
        await readDir(srcDir, ENCODING);
    } catch (err) {
        await mkDir(srcDir);
    }

    console.info('generate react components from svg files');

    await generateComponents();
}

main();
