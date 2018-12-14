'use babel'

import defaultExec from './default-runner'
import spawnRunner from './spawn-runner'

export default function runner (exe, file, cwd) {
    let process = spawnRunner(exe, file, cwd)

    return process
}
