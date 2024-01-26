import Bowser from 'bowser'

export const isMobile = () => {
  return !!navigator.userAgent.match(/AppleWebKit.*Mobile.*/) && !!navigator.userAgent.match(/AppleWebKit/)
}

export const isWindows = () => {
  return /windows|win32/i.test(navigator.userAgent)
}

export const isMac = () => {
  return /macintosh|mac os x/i.test(navigator.userAgent)
}

export const getDeviceInfo = () => {
  const browser = Bowser.getParser(window.navigator.userAgent)
  const isLowVersionBrowser = browser.satisfies({
    safari: '<=9',
    'internet explorer': '<=11',
    chrome: '<=60',
    firefox: '<=60',
    opera: '<=60'
  })
  return {
    basic: Bowser.parse(window.navigator.userAgent),
    custom: {
      isLowVersionBrowser: isLowVersionBrowser
    }
  }
}
