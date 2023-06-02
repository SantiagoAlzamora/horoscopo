import { useState } from 'react'
import { IHoroscopo, calcularSigno, getHoroscopo, signTranslations } from './utils';
import './App.css'
import Loading from 'react-loading';


function App() {
  const [horoscopo, setHoroscopo] = useState<IHoroscopo>()
  const [selectedButton, setSelectedButton] = useState("daily")
  const [signo, setSigno] = useState<string>();
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const data = new FormData(form)
    const date = data.get("date")?.toString()

    if (!date) return
    if (new Date(date) > new Date()) {
      alert("Ingrese una fecha valida")
      return
    }
    setLoading(true)
    const sign = calcularSigno(date)
    const newSigno: string = signTranslations[sign]

    setSigno(newSigno)
    const newHoroscopo = await getHoroscopo(sign)
    setHoroscopo(newHoroscopo)
    
    setLoading(false)
    
  }


  return (
    <main>
      <h1>Calcula tu <span>Signo</span>, lee tu <span>Horoscopo</span></h1>
      <form onSubmit={handleSubmit}>
        <input type="date" name="date" required={true} />
        <button>Submit</button>
      </form>
      <h2>{signo}</h2>
      <section className='buttons'>
        <button onClick={()=>setSelectedButton("daily")}>Daily</button>
        <button onClick={()=>setSelectedButton("weekly")}>Weekly</button>
        <button onClick={()=>setSelectedButton("monthly")}>Monthly</button>
      </section>
      {loading && <p><Loading type='spinningBubbles'/></p>}
      {selectedButton === "daily" && <p>{horoscopo?.daily}</p>}
      {selectedButton === "weekly" && <p>{horoscopo?.weekly}</p>}
      {selectedButton === "monthly" && <p>{horoscopo?.monthly}</p>}
    </main>
  )
}

export default App
