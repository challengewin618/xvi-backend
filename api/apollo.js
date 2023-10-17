const {Constants} = require("../config/constants");
const {setContext} = require("@apollo/client/link/context");
const {ApolloClient, InMemoryCache, createHttpLink} = require("@apollo/client");

const httpLink = createHttpLink({uri: Constants.BITQUERY_GQL_URL})

const authLink = setContext((_, {headers}) => ({
  headers: {
    ...headers,
    'X-API-KEY': Constants.X_API_KEY
  }
}))

const bitQueryApolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

module.exports = {bitQueryApolloClient};
