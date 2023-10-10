// if ifProduction is true, then the path will be the production path
// if ifProduction is false, then the path will be the development path
const isProduction = true

const LOCAL = import.meta.env.VITE_PATH_LOCAL
const DOCKER = import.meta.env.VITE_PATH_DOCKER
const RAILWAY = import.meta.env.VITE_PATH_RAILWAY

// const RAILWAY = process.env.PATH_RAILWAY

const path = {
  get url () {
    return isProduction
      ? 'https://' + RAILWAY
      : 'http://' + LOCAL
  },
  get ws () {
    return isProduction
      ? 'wss://' + RAILWAY
      : 'ws://' + LOCAL
  }
}

export default path
