import { PathLike, readdirSync } from "fs"
import { spawn } from "child_process"
import { join } from "path"
import chalk from "chalk"

const CMD_FOLDER = './system/cmd'
// const CMD_FOLDER_FROM_THIS_DIRNAME = './cmd'
const FILTER_FILE = (file: string) => /\.ts$/.test(file)

export async function loadFile (folder: PathLike = CMD_FOLDER) {
    const FOLDER_FROM_THIS_DIRNAME = (folder as string).replace('./system/', './')
    const files = readdirSync(folder)
    console.log(files)
    let cmds: any[] = []
    for (let file of files.filter(FILTER_FILE)) {
        const isNoError = await checkFile(join(folder as string, file))
        if (!isNoError) {
            console.log(chalk.red(`${file} is not valid`))
            continue
        }
        const cmd = await import(`${FOLDER_FROM_THIS_DIRNAME}/${file}`)
        if (cmd) cmds.push('default' in cmd ? cmd.default : cmd)
    }
    return cmds
}

export function checkFile (file: PathLike) {
    return new Promise<boolean>((resolve) => {
        if (!file) return resolve(false)
        const check = spawn('tsc', [`"${file as string}"`, '"./system/global.d.ts"', '--noEmit', '--esModuleInterop', '--skipLibCheck'], {
            shell: true,
            stdio: ['inherit', 'inherit', 'inherit']
        })
        return Promise.race([
            check.once('exit', (code) => {
                resolve(code == 0)
                if (!check.exitCode) check.kill(1)
            }),
            check.once('error', (err) => {
                resolve(!err)
                if (!check.exitCode) check.kill(1)
            })
        ])

    })
}