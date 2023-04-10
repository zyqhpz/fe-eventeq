const isProduction = true;
// if ifProduction is true, then the path will be the production path
// if ifProduction is false, then the path will be the development path
export default {
    url: isProduction ? "https://be-eventeq.fly.dev/" : "http://localhost:8080/",
};