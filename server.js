// Import dependancies
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')

// Create a schema
const schema = buildSchema(`
type About {
  message: String!
}

enum Manufacturers {
    Porsche
    Ferrari
    Lamborghini
}

type Car {
	name: String!
	manufacturer: Manufacturers! # use an enum!
}

type Mutation {
    addCar(name: String!, manufacturer: String!): Car!
    updateCar(id: Int!, name: String, manufacturer: Manufacturers): Car!
    deleteCar(id: Int!): Car!
}

type Time {
    hour: Int!
    minute: Int!
    second: Int!
}

type DieRoll {
    total: Int!
    sides: Int!
    rolls: [Int!]!
}

type Query {
  getAbout: About
  allCars: [Car!]! # returns a collection of Pet
  getCar(index: Int!): Car
  getCarCount: Int
  firstCar: Car
  lastCar: Car
  getTime: Time
  getRandom: Int
  getRoll: DieRoll
}`)

// Define a resolver
const root = {
    getAbout: () => {
      return { message: 'Hello World' };
    },
    allCars: () => {
        return carList;
    },
    getCar: ({ index }) => { // index is a param from the query
		return carList[index];
    },
    getCarCount: () => {
        return carList.length;
    },
    firstCar: () => {
        return carList[0];
    },
    lastCar: () => {
        return carList[carList.length - 1];
    },
    carsInRange: ({start, count}) => {
        let stop = start + count;
        return carList.slice(start, stop);
    },
    addCar: ({ name, manufacturer }) => {
		const car = { name, manufacturer }
		carList.push(car)
		return car
    },
    updateCar: ({ id, name, manufacturer}) => {
		const car = carList[id]  // is there anything at this id? 
		if (car === undefined) { // Id not return null
			return null 
		}
    // if name or species was not included use the original
		car.name = name || car.name 
		car.species = manufacturer || car.manufacturer
		return pet
    },
    deleteCar: (({id}) => {
        if(id < carList.length){
            let car = carList[id]
            carList.splice(id, 1);
            return car
        }
        return null
    }),
    getTime: () => {
        let d = new Date();
        return {hour: d.getHours, minute: d.getMinutes, second: d.getSeconds};
    },
    getRandom: ({range}) => {
        return Math.random() * (max - 0) + 0;
    },
    getRoll: ({sides, rolls}) => {
        let rollArr = [];
        let total = 0;
        for(let x = 0; x < rolls; x++) {
            let roll = getRandom({sides});
            rollArr.push(roll);
            total += roll;
        }
        return {total: total, sides: sides, rolls: rollArr};
    }
  }

  // Create an express app
const app = express()

// Define a route for GraphQL
app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
}))

// Start this app
const port = 4000
app.listen(port, () => {
  console.log(`Running on port: ${port}`)
})

const carList = [
    {name: '911 Targa 4S', manufacturer: 'Porsche'},
    {name: 'Ferrari 488', manufacturer:'Ferrari'},
    {name: 'Aventador S', manufacturer:'Lamborghini'}
]