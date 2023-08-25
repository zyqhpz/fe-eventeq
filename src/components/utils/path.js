// if ifProduction is true, then the path will be the production path
// if ifProduction is false, then the path will be the development path
const isProduction = false

const LOCAL = import.meta.env.VITE_PATH_LOCAL
const DOCKER = import.meta.env.VITE_PATH_DOCKER

// const RAILWAY = process.env.PATH_RAILWAY

const path = {
  get url () {
    return isProduction
      ? 'https://' + DOCKER
      : 'http://' + LOCAL
  },
  get ws () {
    return isProduction
      ? 'wss://' + DOCKER
      : 'ws://' + LOCAL
  }
}

export default path
