const express = require('express');
const { ApolloServer, UserInputError } = require('apollo-server-express');
const fs=require('fs');

const resolvers = {
  Query: {
    productList,
  },
  Mutation: {
    productAdd,
  },
};

const productDB = [];

const server = new ApolloServer({
  typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
  resolvers,
  formatError: error => {
    console.log(error);
    return error;
  },
});

function productList() { 
  return productDB;
}

function productAdd(_, { product }) {
  product.id = productDB.length + 1;
  productDB.push(product);
  return product;
}

const app = express();
app.use(express.static('public'));
server.applyMiddleware({app, path: '/graphql'});
app.listen(3000, function () {
	console.log('App started on port 3000');
});
