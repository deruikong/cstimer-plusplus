const express = require('express')
const mongoose = require('mongoose')
const app = express()

const baseUrl = "http://localhost:3001"
const password = "zEZW43DgtbX7cJr"
const url = `mongodb+srv://raykong:${password}@cluster0.q3xg5zx.mongodb.net/?retryWrites=true&w=majority`
mongoose.set('strictQuery',false)
mongoose.connect(url)

console.log(url)

// solves = [
//   {
//     "time": 1637,
//     "scramble": "monke L R F U",
//     "id": 1
//   },
//   {
//     "time": 1412,
//     "scramble": "monke L R F U",
//     "id": 2
//   },
// ]

const solveSchema = new mongoose.Schema({
  time: Number,
  scramble: String,
})

const userSchema = new mongoose.Schema({
  username: String,
  friendsList: [String],
  solvesList: [solveSchema]
})

const User = mongoose.model("User", userSchema)
// const Solve = mongoose.model("Solve", solveSchema)

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(express.json())

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/user/', (request, response)=>{
  User.find({}).then(users => {
    console.log(users)
    return response.json(users)
  })
})

app.get('/api/user/:id', (request, response)=>{
  User.findOne({username: request.params.id}).then(user=>{
    return response.json(user)
  })
})

app.post('/api/user/:id', (request, response) => {
  const body = request.body
  // if(!body.time){
  //   return response.status(400).json({ 
  //     error: 'content missing' 
  //   })
  // }
  const user = new User({
    username: request.params.id,
    friendsList: [],
    solvesList: [],
  })
  user.save().then(result=>{
    console.log("user created")
    return response.json(user)
  })
})

app.post('/api/user/:id/solves', (request, response) => {
  const body = request.body
  // console.log("monke")
  if(!body.time){
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const solve = {
    time: body.time,
    scramble: body.scramble,
  }
  console.log(solve, request.params.id)
  const user = User.findOneAndUpdate(
    {username: request.params.id},
    {$push: { solvesList : solve }},
    {returnOriginal: false},
    {upsert: true},
    {new: true}
    ).then(updatedUser => {
      console.log('Address added to user successfully:', updatedUser);
      response.json(updatedUser.solvesList.slice(-1))
    })
    .catch(err => {
      console.error(err);
      response.json(err)
    });
})


const generateId = () => {
  const maxId = solves.length > 0
    ? Math.max(...solves.map(n => n.id))
    : 0
  return maxId + 1
}

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)