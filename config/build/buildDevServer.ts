import { Configuration as DevServerConfiguration } from "webpack-dev-server"
import {BuildOptions} from "./types/types"

export function buildDevServer({port}: BuildOptions): DevServerConfiguration {
 return { // параметр необходим для hot reload сборки при внесении изменений в код
     port: port ?? 3000, // здесь прописываем порт по умолчанию
     open: true, // этот параметр отвечает за открытие в новой вкладке страницы в браузере по умолчанию при старте сервера
     // эта настройка работает только в dev режиме, в prod режиме необходимо настраивать nginx для того чтобы все запросы проксировались на index.html
     historyApiFallback: true, // этот параметр отвечает за поддержку навигации в SPA
     // (при изменении урла в соответствии с роутингом не будет прилетать 404 ошибка)
     hot: true, // этот параметр отвечает за предотвращение перезагрузки страницы при изменении кода (изменения при этом отображаются
     // работает только с нативными js/ts приложениями
     // для реакта нужен отдельнй плагин react-refresh-webpack-plugin
 }
}
