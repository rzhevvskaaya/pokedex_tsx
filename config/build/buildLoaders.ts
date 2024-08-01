import {ModuleOptions} from "webpack"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import ReactRefreshTypeScript from "react-refresh-typescript"
import {BuildOptions} from "./types/types"
import {buildBabelLoader} from "./babel/buildBabelLoader";

export function buildLoaders(options: BuildOptions): ModuleOptions['rules'] {
    const isDev = options.mode === "development"

    const assetLoader = { // данный лоадер нужен для работы с графическими файлами разных типов в проекте
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
    }

    const svgrLoader = { // данный лоадер преобразовывает svg картинки в реакт компоненты, которые можно настраивать через пропсы
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: [
            {
                loader: '@svgr/webpack',
                options: {
                    icon: true,  // свойство icon: true позволяет работать с svg как с иконками
                    svgoConfig: {
                        plugins: [
                            {
                                name: 'convertColors',
                                params: {
                                    currentColor: true, // этот параметр позволяет напрямую менять цвет инонки без испоьлзования параметра fill
                                }
                            },
                        ],
                    }
                },
            },
        ],
    }

    const cssLoaderWithModules = {
        loader: "css-loader",
        options: {
            modules: {
                localIdentName: isDev ? "[path][name]__[local]" : "[hash:base64:8]" // эта настройка отвечает за имена стилей в dev prod режиме
            }, // это свойство отвечает за работу с файлами стилей как с модулями, если modules true или объект тогда со стилями работа как с модулями

        }
    }

    const styleLoader = {
        test: /\.s[ac]ss$/i,
        use: [  // если лоадеров несколько то можно подключать их массивом, все эти лоадеры устанавливаются как npm пакеты, порядок важен для последовательно преобразования кода
            // Creates `style` nodes from JS strings
            isDev
                ? "style-loader"
                : MiniCssExtractPlugin.loader,
            // Translates CSS into CommonJS
            cssLoaderWithModules,
            // Compiles Sass to CSS
            "sass-loader",
        ],
    }

    const tsLoader = {
        // ts-loader умеет работать с JSX
        // если б мы не использовали тайпскрипт, нужен был бы babel-loader
        test: /\.tsx?$/, // регулярка позволяющая опознать нужный тип файлов перед обработкой
        use: 'ts-loader', // указывается название лоадера
        exclude: /node_modules/, // node-modules не обрабатываются
    }

    const tsLoaderCompilerOnly = {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: [
            {
                loader: 'ts-loader',
                options: {
                    transpileOnly: true, // данная опция нужна, чтобы на этапе сборки не проводилась проверка на тайпскрипт
                    // и осуществлялась только транспиляция кода в js
                    // нужно для ускорения сборки, однако для проверки ts нужно добавлять доп проверки ошибок tsc
                    getCustomTransformers: () => ({ // данный метод нужен для валидации типов для обновления реакта в runtime без обновления страницы
                        before: [isDev && ReactRefreshTypeScript()].filter(Boolean),
                    }),
                }
            }

        ]
    }

    const babelLoader = buildBabelLoader(options)

    return [
        assetLoader,
        styleLoader,
        // tsLoader,
        // tsLoaderCompilerOnly,
        babelLoader,
        svgrLoader,
    ]
}
