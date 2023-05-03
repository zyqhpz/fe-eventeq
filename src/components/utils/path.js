const isProduction = true;
// if ifProduction is true, then the path will be the production path
// if ifProduction is false, then the path will be the development path
export default {
  url: isProduction
    ? "https://be-eventeq-production.up.railway.app/"
    : "http://localhost:8080/",
};