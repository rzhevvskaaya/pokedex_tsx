import {BuildOptions} from "../types/types"
import {removeDataDebugIdBabelPlugin} from "./removeDataDebugIdBabelPlugin"

export function buildBabelLoader({mode}: BuildOptions) {
    const isDev = mode === "development"
    const isProd = mode === "production"

    const plugins = []

    if (isProd) {
        plugins.push([
            removeDataDebugIdBabelPlugin, // данный самописный плагин отвечает за удаление лишних пропсов компонентов при бандле
            {
                props: ['data-debug-id'] // указываем название пропса, теперь в прод сборку data-debug-id не попадут
            }
        ])
    }

    return {
        // данный лоадер нужен для транспиляции любого js|ts кода в js код любой указанной версии для обеспечения лучшей совместимости с различными браузерами и устройствами
        // транспиляция кода определяется благодаря пресетам
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            // код ниже перенесен в отдельный файл конфиг, при сборке этот код подтягивается автоматически, options прописывать в лоадере не нужно
            options: // опции можно вынести в отдельный файл babel.config.json, они автоматически подтянутся при сборке
                {
                    presets: [
                        '@babel/preset-env', // этот пресет позволяет транспилировать синтаксис ES2015+ версии
                        '@babel/preset-typescript', // этот пресет позволяет транспилировать ts код
                        ['@babel/preset-react', {
                            runtime: isDev ? 'automatic' : 'classic', // без данного свойства ассета сборка реакт в режиме devserver не запустится
                        }], // этот пресет позволяет транспилировать реакт компоненты
                    ],
                    plugins: plugins.length ? plugins : undefined
                }
        }
    }
}
