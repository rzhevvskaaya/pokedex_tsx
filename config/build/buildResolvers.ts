import {Configuration} from "webpack";
import {BuildOptions} from "./types/types";

export function buildResolvers({paths}: BuildOptions): Configuration['resolve'] {
    return {
        extensions: ['.tsx', '.ts', '.js'], // указаны расширения которые необходимо обработать, позволяет импортить файлы без указывания расширения
        alias: { // данное свойство позволяет прописывать абсолютные пути. Вместо значения прописанного в paths в tsсonfig будет указываться @
            "@": paths.src
        }
    }
}
