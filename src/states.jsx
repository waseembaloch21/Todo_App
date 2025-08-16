import { useState } from 'react'

const States = () => {
    let [count,setCount] = useState(0)

    function handleAdd () {
        setCount(count + 1)
    }
    function handleMinise () {
        setCount(count - 1)
    }
        function restart () {
            setCount(count = 0)
    }
  return (

    <div>
        <p>Count: {count}</p>
        <button onClick={handleAdd}>Add</button>
        <button onClick={handleMinise}>minise</button>
        <button onClick={restart}>reset</button>
    </div>
  )
}


export default States