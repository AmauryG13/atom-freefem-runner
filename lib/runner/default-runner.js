'use babel'

import { execFile } from 'child_process'

export default function defaultExec (executable, args, cwd){
      execFile(executable, [args], {
        cwd: cwd
      }, (error, stdout, stderr) => {
          if (error) return error

          return {
              error: stderr ? true : false,
              output: stderr ? stderr : stdout
          }
      })
}
