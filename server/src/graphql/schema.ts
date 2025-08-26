// src/graphql/schema.ts
import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { UserQuery, UserMutation } from './resolvers/user.resolver';

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      ...UserQuery.getFields(), // If getFields() exists and is correctly typed
      // ...BookQuery.getFields(),
      // ...BorrowQuery.getFields(),
    }),
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      ...UserMutation.getFields(), // If getFields() exists and is correctly typed
      // ...BookMutation.getFields(),
      // ...BorrowMutation.getFields(),
    }),
  }),
});