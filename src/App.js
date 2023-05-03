// import logo from './logo.svg';
import './App.css';
import {useState, useEffect, useRef} from 'react'
import scramby from 'scramby'
import axios from 'axios'
import msToString from './utils'
// import {Timer} from './util.js'

function Scramble({solveCnt}) {
  const scrambler = scramby()

  console.log(solveCnt)
  
  return (
    <p>Solve {solveCnt + 1}: {scrambler.getRandomScramble().scrambleString}</p>
  )
}

function Timer({solveCnt, setSolveCnt, solves, setSolves}) {
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
  // const changeTimerState = () => {
  //   start.current = !start.current
  //   setBeginTime(Date.now())
  //   setTime('0.000')
  // }

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
          time: Date.now() - beginTime.current
        }
        console.log(curSolve)
        axios.post("http://localhost:3001/solves", curSolve)
          .then(response=>{
            console.log(response.data)
            setSolves(solves.concat(response.data))
          })
      }
    }
    // console.log(classState))
    window.addEventListener("keydown", handleKeydown)
    window.addEventListener("keyup", handleKeyup)
    return (() => {
      window.removeEventListener("keydown", handleKeydown)
      window.removeEventListener("keyup", handleKeyup)
    })
    // eslint-disable-next-line
  }, [timerStatus, solveCnt, setSolveCnt, time])

  useEffect(() => {
    console.log(timerStatus)
    if(timerStatus === 3){
      // console.log(start)
      const interval = setInterval(() => {
        const timeElapsed = Date.now() - beginTime.current
        setTime(msToString(timeElapsed))
      }, 1);
      return () => clearInterval(interval);
    }
  }, [timerStatus]);
  console.log(color)
  return (
    <div>
      <h1>Current Time:</h1>
      <h2 style={{color: color}}>{time}</h2>
      {/* <button onClick={pauseTimer}>Pause</button>
      <button onClick={resetTimer}>Reset to 0</button>
      <button onClick={startTimer}>Start</button> */}
    </div>
  )
}

function SolvesList({solves, setSolves}){
  useEffect(() => {
    console.log('effect')
    axios.get("http://localhost:3001/solves")
      .then(response=> {
        console.log('promise fulfilled')
        setSolves(response.data)
      })
  }, [setSolves])
  return (
    <ul>
      {solves.map(solve=><p key={solve.id}>Solve {solve.id}: {msToString(solve.time)}</p>)}
    </ul>
  )
}

function App() {
  const [solves, setSolves] = useState([])
  const [solveCnt, setSolveCnt] = useState(0)
  return (
    <div>
      <Scramble solveCnt={solveCnt}/>
      <Timer solveCnt={solveCnt} setSolveCnt={setSolveCnt} solves={solves} setSolves={setSolves}/>
      <SolvesList solves={solves} setSolves={setSolves}/>
    </div>
  );
}

export default App;
