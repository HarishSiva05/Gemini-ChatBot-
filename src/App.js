import {useState} from 'react'

const App = () => {
  const [value, setValue] =useState("")
  const [error, setError] = useState("")
  const [chatHistory, setchatHistory] = useState([])
  const surpriseOptions = [
    'Who is Aristotle ?',
    'Where is sandwich made?',
    'Who found Pizza?'
  
  ]
  const surprise = () => {
    const randomValue = surpriseOptions[Math.floor(Math.random()*surpriseOptions.length)]
    setValue(randomValue)
  }

  const getResponse = async() => {
    if(!value) {
      setError("Enter your Question")
      return
    }
    try {

      const options ={
        method: 'POST',
        body: JSON.stringify({
          history: chatHistory,
          message: value
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch('http://localhost:8000/gemini', options)
      const data = await response.text()
      console.log(data)
      setchatHistory(oldChatHistory => [...oldChatHistory, {
        role: "user",
        parts: value
      },
    {
      role:"AI",
      parts: data
    }])
    setValue("")

    } catch (error) {
      console.error(error)
      setError("Please try Again ")
    }
  } 
  const clear = () => {
    setValue("")
    setError("")
    setchatHistory([])
  }

  return(

      <div className="app">
        <p>What do you have in your mind ? 
        <button className="surprise" onClick={surprise} disabled={!chatHistory}>Hit me !</button>
        </p>

        <div className="input-container">
        <input
          value={value}
          placeholder="When is NewYear ?"
          onChange={ (e)=> setValue(e.target.value)}
        />

        {!error && <button onClick={getResponse}> Ask me</button>}
        {error && <button onClick={clear}>Clear</button>}

        </div>
        {error && <p>{error}</p>}
        <div className='search-result'>
        {chatHistory.map((chatItem, _index) => <div key={_index}>
          <p className='answer'>{chatItem.role}:{chatItem.parts}</p>
          </div>)}
        </div>

        </div>
  
    

  )

}
export default App