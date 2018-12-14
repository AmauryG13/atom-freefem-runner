'use babel'

export default {
    success(message, desc) {
      message = formatNotifMsg(message)
      atom.notifications.addSuccess(message, {
          description: desc
      })
    },
    info(message, desc) {
      message = formatNotifMsg(message)
      atom.notifications.addInfo(message, {
          description: desc
      })
    },
    error(message, desc) {
      message = formatNotifMsg(message)
      atom.notifications.addSuccess(message, {
          description: desc
      })
    },
    fatal(message) {
      message = formatNotifMsg(message)
      atom.notifications.addSuccess(message, {})
    }
}

function formatNotifMsg(msg) {
    return `[FreeFem++] ${msg}`
}
