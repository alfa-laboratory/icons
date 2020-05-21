![BUILD](https://github.com/alfa-laboratory/icons/workflows/BUILD/badge.svg?branch=master&event=repository_dispatch)

# Alfa Bank Icons

React компонент Icon

[Вставить ссылку на витрину иконок](https://github.com/alfa-laboratory/icons)

### Как сюда попадают новые иконки
- Дизайнер рисует [иконку в фигме](https://www.figma.com/file/QoGuPDB1hAMoMMqsQQ4Mx7lB/Icons?node-id=3882%3A144).
- С помощью [фигма-плагина](https://www.figma.com/community/plugin/822773501021259599/Publish-Icons) автоматически создается пулл-реквест с иконкой в репозиторий [alfa-ui-primitives](https://github.com/alfa-laboratory/alfa-ui-primitives).
- После мерджа пулл-реквеста в [alfa-ui-primitives](https://github.com/alfa-laboratory/alfa-ui-primitives) и публикации нового пакета, с помощью github-actions начинается процесс генерации новых реакт-компонентов на основе svg-файла иконки.
- После успешной генерации новых React-компонетов, публикуются новые версии пакета.

### Какие есть пакеты иконок
На данный момент есть следующие пакеты иконок:
| Пакет | Ссылка на npmjs.com | Описание
| ------ | ------ | ------
| @alfalab/icons | [@alfalab/icons](https://www.npmjs.com/package/@alfalab/icons) | Общий пакет со всеми иконками
| @alfalab/icons-classic | [@alfalab/icons-classic](https://www.npmjs.com/package/@alfalab/icons-classic) |  
| @alfalab/icons-glyph | [@alfalab/icons-glyph](https://www.npmjs.com/package/@alfalab/icons-glyph) |  Иконки в новом стиле

### Как импортить иконки в проект
Если у вас в проекте настроен tree-shaking, то можно импортить из корня:

`import { AddIcon } from '@alfalab/icons-classic';`

Если у вас по какой-то причине не работает tree-shaking, то импортируйте напрямую из файла:

`import { AddIcon } from '@alfalab/icons-classic/AddIcon';`

или

`import AddIcon from '@alfalab/icons-classic/AddIcon';`
