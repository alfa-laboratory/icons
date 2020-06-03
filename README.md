<p class="readme-header"><img width="914" alt="Библиотека иконок в виде React компонентов" src="https://user-images.githubusercontent.com/109410/82576705-a987c800-9b92-11ea-889d-dd3f04d13662.png"></p>

![BUILD](https://github.com/alfa-laboratory/icons/workflows/BUILD/badge.svg?branch=master&event=repository_dispatch)

## Витрина иконок
[Демо](https://alfa-laboratory.github.io/icons-demo/)

## Как сюда попадают новые иконки
- Дизайнер рисует [иконки в фигме](https://www.figma.com/file/QoGuPDB1hAMoMMqsQQ4Mx7lB/Icons?node-id=3882%3A144).
- С помощью [фигма-плагина](https://www.figma.com/community/plugin/822773501021259599/Publish-Icons) создаётся пулл-реквест с иконками в репозиторий [alfa-ui-primitives](https://github.com/alfa-laboratory/alfa-ui-primitives).
- После мёрджа пулл-реквеста в [alfa-ui-primitives](https://github.com/alfa-laboratory/alfa-ui-primitives) и публикации нового пакета, с помощью github-actions начинается процесс генерации новых реакт-компонентов на основе svg-файлов иконок.
- После успешной генерации новых React-компонетов, публикуются новые версии пакетов.

## Какие есть пакеты иконок
На данный момент есть следующие пакеты иконок:
| Пакет | Ссылка на npmjs.com | Описание
| ------ | ------ | ------
| @alfalab/icons | [@alfalab/icons](https://www.npmjs.com/package/@alfalab/icons) | Общий пакет со всеми иконками
| @alfalab/icons-classic | [@alfalab/icons-classic](https://www.npmjs.com/package/@alfalab/icons-classic) |  
| @alfalab/icons-glyph | [@alfalab/icons-glyph](https://www.npmjs.com/package/@alfalab/icons-glyph) |  Иконки в новом стиле

## Как импортить иконки в проект
Если у вас в проекте настроен tree-shaking, то можно импортить из корня:

`import { AddMIcon } from '@alfalab/icons-glyph';`

Если у вас по какой-то причине не работает tree-shaking, то импортируйте напрямую из файла:

`import { AddMIcon } from '@alfalab/icons-glyph/AddMIcon';`

или

`import AddMIcon from '@alfalab/icons-glyph/AddMIcon';`

## Размеры иконок
Все иконки соответствуют [размерной сетке](https://github.com/alfa-laboratory/alfa-ui-primitives/wiki/%D0%A2%D1%80%D0%B5%D0%B1%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BA-%D0%B8%D0%BA%D0%BE%D0%BD%D0%BA%D0%B0%D0%BC).

## Цвет иконок
В пакете `@alfalab/icons-glyph` цвет иконок задается атрибутом `fill="currentColor"`. То есть цвет наследуется от родительского свойства `color`.

В пакете `@alfalab/icons-classic` цвет иконок не наследуется.
