import webpack from "webpack"
import {buildDevServer} from "./buildDevServer"
import {buildLoaders} from "./buildLoaders"
import {buildPlugins} from "./buildPlugins"
import {buildResolvers} from "./buildResolvers"
import {BuildOptions} from "./types/types"

export function buildWebpack(options: BuildOptions): webpack.Configuration {
    const {mode, paths} = options
    const isDev = options.mode === "development"

    return {
        mode, // режим сборки проекта (dev | prod), вебпак сам прокидывает env в качестве аргумента
        entry: paths.entry,
        output: {
            path: paths.output, // путь куда будет генериться сбандленный файл
            filename: '[name].[contenthash].js', // задаем имя сбандленного файла, name по умолчанию main, contenthash - хэш сумма генерируемая на базе содержимого файлов. Новые правки - новая хеш сумма
            clean: true, // автоочистка сбандленной папки для удаления предыдущих версий сборок
        },
        plugins: buildPlugins(options), // плагины отвечают за бандл дополнительных типов файлов, при каждой пересборке плагины возвращают сбандленные файлы
        module: {
            rules: buildLoaders(options) // лоадеры это массив обработчиков, преобразовывающих код перед бандлом.
            // КРАЙНЕ ВАЖЕН ПОРЯДОК ЛОАДЕРОВ, лоадеры запускаются с конца в начало массива
        },
        resolve: buildResolvers(options),
        devtool: isDev && 'inline-source-map', // параметр необходим для определения стека ошибок и для чтения исходного кода в исходном состоянии на случай появления ошибки на странице
        devServer: isDev ? buildDevServer(options) : undefined, // параметр необходим для hot reload сборки при внесении изменений в код
    }
}
