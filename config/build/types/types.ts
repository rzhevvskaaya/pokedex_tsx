export interface BuildPaths {
    entry: string
    html: string
    output: string
    public: string
    src: string
}

export type BuildMode = 'production' | 'development'

export type BuildPlatformMode = 'mobile' | 'desktop'

export interface BuildOptions {
    port: number
    paths: BuildPaths
    mode: BuildMode
    platform: BuildPlatformMode
    analyzer?: boolean
}
