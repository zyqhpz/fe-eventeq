// if ifProduction is true, then the path will be the production path
// if ifProduction is false, then the path will be the development path
const isProduction = false

const path = {
  get url () {
    return isProduction
      ? 'https://be-eventeq-production.up.railway.app/'
      : 'http://localhost:8080/'
  },
  get ws () {
    return isProduction
      ? 'ws://be-eventeq-production.up.railway.app/'
      : 'ws://localhost:8080/'
  }
}

export default path
