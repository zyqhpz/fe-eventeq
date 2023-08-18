// if ifProduction is true, then the path will be the production path
// if ifProduction is false, then the path will be the development path
const isProduction = true

const path = {
  get url () {
    // ? 'https://be-eventeq-production.up.railway.app/'
    return isProduction
      ? 'http://54.254.192.61:8080/'
      : 'http://localhost:8080/'
  },
  get ws () {
    // ? 'wss://be-eventeq-production.up.railway.app/'
    return isProduction
      ? 'ws://54.254.192.61:8080/'
      : 'ws://localhost:8080/'
  }
}

export default path
