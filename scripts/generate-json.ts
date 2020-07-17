/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import camelcase from 'camelcase';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { ICON_POSTFIX, getPackageName, ENCODING } from './constants';

const FIGMA_API_URL = 'https://api.figma.com/v1';
const FIGMA_FILE_ID = 'QoGuPDB1hAMoMMqsQQ4Mx7lB';
const FIGMA_API_TOKEN = process.env.FIGMA_TOKEN;

const writeFile = promisify(fs.writeFile);

type FrameInfo = {
    nodeId: string;
    name: string;
    pageId: string;
    pageName: string;
};

type FigmaComponent = {
    key: string;
    file_key: string;
    node_id: string;
    thumbnail_url: string;
    name: string;
    description: string;
    updated_at: string;
    created_at: string;
    containing_frame: FrameInfo;
};

type FigmaResponse = {
    status: number;
    error: boolean;
    meta: {
        components: FigmaComponent[];
    };
};

enum PAGES {
    icon = 'icon',
    glyph = 'glyph',
    flag = 'flag',
}

const ICON_NAME_REG_EXP = {
    [PAGES.icon]: /^(?:icon_[a-z0-9-]+\/)?icon_([a-z0-9-]+)_([a-z0-9]+)(?:_([a-z0-9]+))$/i,
    [PAGES.glyph]: /^([a-z0-9-]+)_([a-z0-9]+)_*([a-z0-9]*)$/i,
    [PAGES.flag]: /^([a-z0-9-]+)_([a-z0-9]+)_*([a-z0-9]*)$/i,
};

const nameParsers = {
    [PAGES.icon]: (origName: string) => {
        const m = ICON_NAME_REG_EXP[PAGES.icon].exec(origName);

        if (!m) {
            return null;
        }

        return {
            name: m[1],
            size: m[2],
            color: m[3] || '',
        };
    },
    [PAGES.glyph]: (origName: string) => {
        const m = ICON_NAME_REG_EXP[PAGES.glyph].exec(origName);

        if (!m) {
            return null;
        }

        return {
            name: m[1],
            size: m[2],
            color: m[3] || '',
        };
    },
    [PAGES.flag]: (origName: string) => {
        const m = ICON_NAME_REG_EXP[PAGES.flag].exec(origName);

        if (!m) {
            return null;
        }

        return {
            name: m[1],
            size: m[2],
            color: m[3] || '',
        };
    },
};

function getName(iconComponent: FigmaComponent): string {
    const page = iconComponent.containing_frame.pageName;

    if (!nameParsers[page]) {
        return null;
    }

    const icon = nameParsers[page](iconComponent.name);

    return icon
        ? `${page}_${icon.name}_${icon.size}${
              icon.color ? `_${icon.color}` : ''
          }`
        : null;
}

/**
 * Генерация JSON-файла для витрины иконок.
 * Этот файл нужен для поиска иконок по их description из фигмы
 */
export async function generateJson() {
    const reqUrl = `${FIGMA_API_URL}/files/${FIGMA_FILE_ID}/components`;

    const {
        data: {
            meta: { components },
        },
    } = await axios.get<FigmaResponse>(reqUrl, {
        headers: { 'X-FIGMA-TOKEN': FIGMA_API_TOKEN },
    });

    const json = {};

    components.forEach(component => {
        const figmaIconName = component.name;
        const svgIconName = getName(component);

        if (svgIconName) {
            const [rawPackageName, name, size, color] = svgIconName.split('_');
            let reactIconName = `${name}_${size}${color ? `_${color}` : ''}`;

            reactIconName = camelcase(reactIconName, {
                pascalCase: true,
            });

            reactIconName += ICON_POSTFIX;

            const packageName = getPackageName(rawPackageName);

            if (!json[packageName]) {
                json[packageName] = {};
            }

            json[packageName][reactIconName] = {
                figmaIconName,
                svgIconName,
                reactIconName,
                figmaDescription: component.description,
            };
        }
    });

    const jsonFileName = path.resolve(__dirname, '../dist/search.json');

    await writeFile(jsonFileName, JSON.stringify(json), ENCODING);
}

generateJson();
