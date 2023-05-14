// import logo from './logo.svg';
import './App.css';
import {useState, useEffect, useRef} from 'react'
import scramby from 'scramby'
import axios from 'axios'
import utils from './utils'
import {Button} from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import Container from 'react-bootstrap/Container'
// import {Timer} from './util.js'

function User({setSolves, userId}){
  const [username, setUsername] = useState("");
  const logIn = (event)=> {
    event.preventDefault()
    console.log(username)

    if(!username){
      console.error("no username provided")
    }
    else{
      axios.get(`http://localhost:3001/api/user/${username}`)
        .then(response => {
          console.log('promise fulfilled with response: ', response)
          // create user
          if(!response.data){
            console.log("registered", username)
            axios.post(`http://localhost:3001/api/user/${username}`).then(response=>{
              console.log(response.data._id)
              userId.current = response.data._id
            })
          }
          else{
            console.log("logged in", username)
            // console.log
            console.log(response.data._id)
            setSolves(response.data.solvesList)
            userId.current = response.data._id
          }
          userId.current = username
        })
      }
  }

  const handleUsername = (event) => {
    // console.log()
    setUsername(event.target.value)
  }

  return (
    // <Container>
      <Form onSubmit={logIn}>
        <Form.Group as={Row}>
            <Form.Label>Username</Form.Label>
            <Form.Control value={username} onChange={handleUsername} placeholder="username"/>
        </Form.Group>
        <Form.Group as={Row} controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" laceholder="Password" />
        </Form.Group>
        <Form.Group>
            <Button type="submit">save</Button>
        </Form.Group>
      </Form>
    // </Container>
  )
}

function Scramble({solveCnt, scramble}) {
  // console.log(solveCnt)
  console.log(scramble)
  return (
    <h2 className='text-center display-5'>{scramble}</h2>
  )
}

function Timer({userId, solveCnt, setSolveCnt, solves, setSolves, scramble, setScramble}) {
  const [time, setTime] = useState('0.000')
  const [timerStatus, setTimerStatus] = useState(0) // 0 = haven't start, 1 = keydown, 2 = timer ready, 3 = start
  const lastKeydown = useRef()
  const beginTime = useRef()

  // styling
  let color = 'black'
  if(timerStatus === 0){
    color = 'black'
  }else if(timerStatus === 1){
    color = 'blue'
  }else if(timerStatus === 2){
    color = 'red'
  }else{
    color = 'green'
  }

  useEffect(() =>{
    const handleKeydown = event => {

      if(timerStatus === 1 && Date.now() - lastKeydown.current > 100){
        setTimerStatus(2)
        setTime('0.000')
      }
      else if(timerStatus === 0){
        setTimerStatus(1)
        lastKeydown.current = Date.now()
      }     // console.log("babodebado")
    }

    const handleKeyup = event => {
      if(timerStatus === 2){
        beginTime.current = Date.now()
        setTimerStatus(3)
      }else if(timerStatus === 1){
        setTimerStatus(0)
      }else if(timerStatus === 3){
        setTimerStatus(0)
        setSolveCnt(solveCnt + 1)
        const curSolve = {
          time: Date.now() - beginTime.current,
          scramble: scramble
        }
        // console.log(curSolve)
        axios.post(`http://localhost:3001/api/user/${userId.current}/solves`, curSolve)
          .then(response=>{
            console.log(response.data)
            setSolves(solves.concat(response.data))
          })
        
        const scrambler = scramby()
        setScramble(scrambler.getRandomScramble().scrambleString)
      }
    }
    // console.log(classState))
    document.getElementById("solver").addEventListener("keydown", handleKeydown)
    document.getElementById("solver").addEventListener("keyup", handleKeyup)
    // document.getElementById("solver").addEventListener("mousedown", ()=>alert("mousedonw"))
    return (() => {
      document.getElementById("solver").removeEventListener("keydown", handleKeydown)
      document.getElementById("solver").removeEventListener("keyup", handleKeyup)
    })
    // eslint-disable-next-line
  }, [timerStatus, scramble])

  useEffect(() => {
    // console.log(timerStatus)
    if(timerStatus === 3){
      // console.log(start)
      const interval = setInterval(() => {
        const timeElapsed = Date.now() - beginTime.current
        setTime(utils.msToString(timeElapsed))
      }, 1);
      return () => clearInterval(interval);
    }
  }, [timerStatus]);
  // console.log(color)
  return (
    // <div className="mx-auto">
    //   <h1>Current Time:</h1>
    <div className='mx-auto'>
      <h1 className='display-1 text-center py-3' style={{color: color}}> {time}</h1>
    </div>
  )
}

function SolvesList({solves, setSolves}){
  // console.log(solves)
  return (
    // <></>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Number</th>
            <th>Time</th>
            <th>Ao5</th>
            <th>Ao12</th>
          </tr>
        </thead>
        <tbody>
          {
            solves.slice(0).reverse().map((solve, index)=>{
              index = solves.length - index - 1
              const ao5 = utils.getAO(solves, index, 5)
              const ao12 = utils.getAO(solves, index, 12)
              console.log(ao5, ao12)
              return (
                <tr key={solve._id}>
                  <td>{index + 1}</td>
                  <td>{utils.msToString(solve.time)}</td>
                  <td>{ao5?utils.msToString(parseInt(ao5)):''}</td>
                  <td>{ao12?utils.msToString(parseInt(ao12)):''}</td>
                </tr> 
              )
            }
            )
          }
        </tbody>
      </Table>
  )
}

function App() {
  const [solves, setSolves] = useState([])
  const [solveCnt, setSolveCnt] = useState(0)
  const [scramble, setScramble] = useState(0)
  const userId = useRef("monke")
  console.log(userId.current)
  // setScramble("monke")
  useEffect(()=>{
    const scrambler = scramby()
    setScramble(scrambler.getRandomScramble().scrambleString)
  }, [])
  return (
    <div style={{height: '100vh', width: '100vw', backgroundColor: "skyblue", overflow: "hidden"}}>
      {/* <Row>
        <Col sm={4}>
        </Col>
        <Col>
        </Col>
      </Row> */}
      {/* <Container> */}
        <Row className='h-100' >
          <Col className='pl-0 pr-0' sm={3} style={{height: '100%'}}>
            <div className='h-50'>
              <User setSolves={setSolves} userId={userId}/>
            </div>
            <Container className="h-50" style={{overflowY: 'auto', overflowX: 'hidden', backgroundColor:'lightcyan'}}>
              <SolvesList solves={solves} setSolves={setSolves}/>
            </Container>
          </Col>
          <Col className='pl-0 pr-0' sm={9} style={{height: '100%'}} id="solver" tabIndex="0"> 
            {/* <p>monke</p> */}
            <div className='h-25' style={{backgroundColor:'lightyellow'}}>
              <Scramble solveCnt={solveCnt} scramble={scramble}/>
            </div>
            <div className='h-75 my-auto w-100' style={{backgroundColor:'lightgreen'}}>
              <Timer userId={userId} solveCnt={solveCnt} setSolveCnt={setSolveCnt} solves={solves} setSolves={setSolves} scramble={scramble} setScramble={setScramble}/>
            </div>
          </Col>
        </Row>
      {/* </Container> */}
    </div>
    // <div className="container" style={{height: '100vh'}}>
    //   <div className="row h-100">
    //     <div className="col">
    //       <h1 className="text-center py-5">Centered Text</h1>
    //       {/* <p clclassNameass="text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p> */}
    //     </div>
    //   </div>
    // </div>
  );
}

export default App;