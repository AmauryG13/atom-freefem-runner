'use babel'

import { exec } from 'child_proccess'

export default function exec (exec, args, cwd){
      exec(executable, args, {
        cwd: cwd
      }, (error, stdout, stderr) => {
          if (error) return error

          return {
              error: stderr ? true : false,
              output: stderr ? stderr : stdout
          }
      })
}
