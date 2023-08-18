// if ifProduction is true, then the path will be the production path
// if ifProduction is false, then the path will be the development path
const isProduction = true

const path = {
  get url () {
    // ? 'http://54.254.192.61:8080/'
    return isProduction
      ? 'https://be-eventeq-production.up.railway.app/'
      : 'http://localhost:8080/'
  },
  get ws () {
    // ? 'ws://54.254.192.61:8080/'
    return isProduction
      ? 'wss://be-eventeq-production.up.railway.app/'
      : 'ws://localhost:8080/'
  }
}

export default path
