'use babel'

import p from 'path'

export default {
  parseFileInfo(path) {
    file = p.basename(path)
    ext = p.extname(file)
    dir = p.dirname(path)

    return {
        path: dir,
        name: file,
        ext: ext
    }
  }
}
