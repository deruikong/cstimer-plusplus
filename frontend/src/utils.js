const msToString = (curTime) => {
  const ms = curTime%1000
  const s = parseInt(curTime/1000) % 60
  const m = parseInt(curTime/1000/60) % 60
  // console.log(m, s, ms)
  return (m? m + ":":'') + s + "." + (ms < 100?'0':'') + (ms<10?'0':'') + ms
}

const strToMs = (str) => {
  const arr = str.split(/[:.]/)
  if (arr.length !== 3){
    const [s, ms] = arr
    return parseInt(s) * 1000 + parseInt(ms)
  }
  else{
    const [m, s, ms] = arr
    return parseInt(m) * 60 * 1000 + parseInt(s) * 1000 + parseInt(ms)
  }
}

const getAO = (arr, index, cnt) => {
  if(index + 1 - cnt < 0) return null;
  else{
    const nArr = arr.slice(index - cnt + 1, index + 1);
    nArr.sort((a, b) => (a.time - b.time));
    console.log(`Array of ${cnt}`, nArr)
    console.log("Average of ${cnt}", nArr.slice(1, cnt - 1).reduce((accumulator, curValue)=>(accumulator + curValue.time), 0) / (cnt - 2))
    return nArr.slice(1, cnt - 1).reduce((accumulator, curValue)=>(accumulator + curValue.time), 0) / (cnt - 2)
  }
}
const exportedMethods = {msToString, getAO, strToMs}
export default exportedMethods;