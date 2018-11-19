const axios = require("axios");
const  {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require("graphql");

/*//HardCoded Data

const customers = [
  {id:'1', name:'John Doe', email:'jdoe@gmail.com', age:35},
  {id:'2', name:'Steve Smith', email:'steve@gmail.com', age:25},
  {id:'3', name:'Sara Williams', email:'sara@gmail.com', age:32},
];*/


//Customer Type
const CustomerType= new GraphQLObjectType({
  name: "Customer",
  fields: () => ({
    id: {type:GraphQLString},
    name: {type:GraphQLString},
    email: {type:GraphQLString},
    age: {type:GraphQLInt},
  })
})

//Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    customer: {
      type: CustomerType,
      args:{
        id: {type:GraphQLString}
      },
      resolve(parentValue, args){
        /*for(let i = 0; i < customers.length; i++){
          if(customers[i].id == args.id){
            return customers[i];
          }
        }*/
        return axios.get("http://localhost:3000/customers/"+args.id)
          .then( res => res.data )
      }
    },
    customers: {  //if no arg then without ()
      type: new GraphQLList(CustomerType),
      resolve(parentValue, args){
        return axios.get("http://localhost:3000/customers/")
          .then( res => res.data )
      }
    }
  }
});

//Mutations
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    //######################################
    addCustomer: {
      type: CustomerType,
      args:{
        name: {type: new GraphQLNonNull(GraphQLString)},
        email: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve(parentVal, args){
        return axios.post("http://localhost:3000/customers/", {
          name: args.name,
          email: args.email,
          age: args.age,
        }).then( res => res.data );
      }
    },
    //######################################
    deleteCustomer: {
      type: CustomerType,
      args:{
        id: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve(parentVal, args){
        return axios.delete("http://localhost:3000/customers/"+ args.id).then( res => res.data );
      }
    },
    //######################################
    //axios.patch
    updateCustomer: {
      type: CustomerType,
      args:{
        id: {type: new GraphQLNonNull(GraphQLString)},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        age: {type: GraphQLInt}
      },
      resolve(parentVal, args){
        return axios.patch("http://localhost:3000/customers/"+args.id, {
          name: args.name,
          email: args.email,
          age: args.age,
        }).then( res => res.data );
      }
    },
  }
});
/*
 mutation{
  addCustomer(name:"Max Kopych", email: "test@test.com",age: 30){
    id,
    name,
    email
  }
}
* */
/*mutation{ --- this how you make calls
      updateCustomer(id: "VcheYmN", age:50){
        age
      }
    }*/

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});