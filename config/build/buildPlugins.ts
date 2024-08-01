import path from "path"
import webpack, {Configuration, DefinePlugin} from "webpack"
import HtmlWebpackPlugin from "html-webpack-plugin"
import {BundleAnalyzerPlugin} from "webpack-bundle-analyzer"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin"
import CopyPlugin from "copy-webpack-plugin"
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin"
import {BuildOptions} from "./types/types"

export function buildPlugins({mode, paths, analyzer, platform}: BuildOptions): Configuration["plugins"] {
    const isDev = mode === "development"
    const isProd = mode === "production"

    const plugins: Configuration["plugins"] = [
        new HtmlWebpackPlugin({ // плагин отвечающий за добавление сбандленных скриптов
            template: paths.html, // это свойство отвечает за то чтобы брать определенный шаблон html страницы
            favicon: path.resolve(paths.public, 'favicon.ico') // это свойство отвечает за взятие статичной иконки из определенного места
        }),
        // на заранее заготовленную HTML страничку
        // если не указать template то плагин сам сгенерирует дефолтный файл
        new DefinePlugin({ // данный плагин нужен для импортирования в приложения различных внешних переменных
            __PLATFORM__: JSON.stringify(platform), // обязательна обертка в json.stringify
        }),
    ]

    if (isDev) {
        plugins.push(new webpack.ProgressPlugin()) // данный плагин нужен для показа в дев режиме прогресса сборки проекта в % соотношении.
        plugins.push(new ForkTsCheckerWebpackPlugin()) // данный плагин нужен для проверки тайпскрипта, но вне процесса сборки (когда transpileOnly: true)
        // процесс сборки можно увидеть в консоли
        plugins.push(new ReactRefreshWebpackPlugin()) // данный плагин нужен для обновления реакта после внесения изменений в код без обновления страницы
    }

    if (isProd) {
        plugins.push(new MiniCssExtractPlugin({  // данный плагин нужен для бандла всех css стилей в сss файлы
            filename: 'css/[name].[contenthash].css', // складываем готовый файл css в папку css имя файла и контентхэш высчитываются по аналогии с html
            chunkFilename: 'css/[name].[contenthash].css',
        }))
        plugins.push(new CopyPlugin({ // данный плагин нужен для копирования статических файлов в итоговую сборку без изменений
            patterns: [
                { from: path.resolve(paths.public, 'locales'), to: path.resolve(paths.output, 'locales') }, // здесь указывается откуда статические файлы копируются и куда
            ],
        }),)
    }

    if (analyzer) {
        plugins.push(new BundleAnalyzerPlugin())
    }

    return plugins
}
