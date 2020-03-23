import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
/* eslint-disable import/no-extraneous-dependencies */
import camelcase from 'camelcase';
/* eslint-disable import/no-extraneous-dependencies */
import Svgo from 'svgo';

import { iconTemplate } from '../templates/Icon.template';
import { SVG_EXT, ENCODING } from './generate';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const ICON_POSTFIX = 'Icon';

const svgo = new Svgo({
    plugins: [
        { convertPathData: { noSpaceAfterFlags: false } },
        { mergePaths: { noSpaceAfterFlags: false } },
        { removeAttrs: { attrs: '(stroke|fill|xmlns)' } },
        { removeXMLNS: true },
        { prefixIds: true },
        { removeViewBox: false },
    ],
});

const transformSvg = (svg: string): string =>
    svg
        .replace(/fill-rule/g, 'fillRule')
        .replace(/clip-rule/g, 'clipRule')
        .replace(/fill-opacity/g, 'fillOpacity')
        .replace(/xmlns:xlink/g, 'xmlnsXlink')
        .replace(/xlink:href/g, 'xlinkHref');

export async function createComponent(filePath: string, packageDir: string) {
    const fileContent = await readFile(filePath, ENCODING);

    let { data } = await svgo.optimize(fileContent);

    data = transformSvg(data);

    let componentName = path
        .basename(filePath, `.${SVG_EXT}`)
        .split('_')
        .slice(1)
        .join('_');

    componentName = camelcase(componentName, {
        pascalCase: true,
    });

    componentName += ICON_POSTFIX;

    const componentContent = iconTemplate
        .replace('{{ComponentName}}', `${componentName}`)
        .replace('{{body}}', data)
        .replace(
            '<svg',
            '<svg className={className} focusable="false" fill="currentColor"',
        );

    const fullFileName = path.join(packageDir, `${componentName}.tsx`);

    await writeFile(fullFileName, componentContent, ENCODING);
}
