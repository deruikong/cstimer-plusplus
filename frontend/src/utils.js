const msToString = (curTime) => {
  const ms = curTime%1000
  const s = parseInt(curTime/1000) % 60
  const m = parseInt(curTime/1000/60) % 60
  // console.log(m, s, ms)
  return (m? m + ":":'') + s + "." + (ms < 100?'0':'') + (ms<10?'0':'') + ms
}

const getAO = (arr, index, cnt) => {
  if(index + 1 - cnt < 0) return null;
  else{
    const nArr = arr.slice(index - cnt + 1, index + 1);
    nArr.sort();
    console.log(`Array of ${cnt}`, nArr)
    return nArr.slice(1, cnt - 2).reduce((accumulator, curValue)=>(accumulator + curValue.time), 0) / (cnt - 2)
  }
}
const exportedMethods = {msToString, getAO}
export default exportedMethods;