'use babel'

import { exec } from './default-runner'

export default function runner (exe, file, cwd) {
    exec(exe, file, cwd)
}
