const msToString = (curTime) => {
  const ms = curTime%1000
  const s = parseInt(curTime/1000) % 60
  const m = parseInt(curTime/1000/60) % 60
  console.log(m, s, ms)
  return (m? m + ":":'') + s + "." + (ms < 100?'0':'') + (ms<10?'0':'') + ms
}
// const exportedMethods = {msToString}
export default msToString;