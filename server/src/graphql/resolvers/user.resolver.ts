import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLFieldConfigMap } from 'graphql';
import { userService } from '../../services/auth.service';
import { UserType, UserRoleEnum } from '../schema/user.schema';
import { IUser } from '../../types/user';

export const UserQuery = new GraphQLObjectType({
  name: 'UserQuery',
  fields: (): GraphQLFieldConfigMap<any, any> => ({
    getUsers: {
      type: new GraphQLList(UserType),
      resolve: () => userService.getAllUsers(),
    },
  }),
});

// Ensure UserMutation fields are also properly typed
export const UserMutation = new GraphQLObjectType({
  name: 'UserMutation',
  fields: (): GraphQLFieldConfigMap<any, any> => ({
    registerUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        role: { type: UserRoleEnum },
      },
      resolve: (_, args: any) => {
        const userInput: IUser = {
          name: args.name,
          email: args.email,
          password: args.password,
          role: args.role ?? 'Member',
        };
        return userService.createUser(userInput);
      },
    },
    loginUser: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, args: any) => {
        return userService.login({
          email: args.email,
          password: args.password,
        });
      },
    },
  }),
});