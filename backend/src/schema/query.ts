import { GraphQLList, GraphQLObjectType } from "graphql";
import { taskList } from "../repository";
import { taskGQL } from "./object";

export const queryGQL = new GraphQLObjectType({
  name: "Query",
  fields: {
    taskList: {
      type: new GraphQLList(taskGQL),
      resolve: taskList,
    },
    searchTask: {
      
    }
  },
});
