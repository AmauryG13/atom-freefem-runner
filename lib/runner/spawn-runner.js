'use babel'

import { spawn } from 'child_process'

export default function spawnRunner(executable, args, cwd) {
    return spawn(executable, [args], {
              cwd: cwd
           })
}
