import './App.css';
import { FaSearch, FaWind } from 'react-icons/fa'
import { ImLocation } from 'react-icons/im'
import { SiRainmeter } from 'react-icons/si'
import { useState } from 'react'
import ClipLoader  from 'react-spinners/ClipLoader'
import Error from './components/error/Error';
import axios from 'axios'

function App() {

  const [back, setBack] = useState('back-night')
  const [city, setCity] = useState('')
  const [dataCity, setDataCity] = useState({})
  const [viewData, setViewData] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingBack, setLoadingBack] = useState(true)
  const [error, setError] = useState('')
  const [closeError, setCloseError] = useState(false)

    const DateNow = () =>{
      const LocalDate = new Date()
      const hr = LocalDate.getHours()
      
      if(hr >= 18 || hr < 5){
          setBack("back-night")
          setLoadingBack(false)
      }
      else if(hr >= 5 || hr < 18){
          setBack("back-day")
          setLoadingBack(false)
      }
  }
  setInterval(DateNow, 1000)

const handleChange = e =>{
  setCity(e.target.value)
}

const search = async () =>{
    setLoading(true)

    await axios.get("https://api.openweathermap.org/data/2.5/weather?q="+city+"&lang=pt&appid=198055475ddb9fecdf52fd52477e529b")
    .then((response)=>{
      setLoading(false)
      setDataCity(response.data)
      setCity('')
      setViewData(true)
    })
    .catch((err)=>{
      setLoading(false)
      setError("Cidade não encontrada, tente novamente")
      setCloseError(true)
      setTimeout(()=>{
        setCloseError(false)
      },3000)
    })
}

  return (
    <>
    {loadingBack  ? 
    <div className='loadingBack'>
      <label><span>RS</span> Weather</label>
      <ClipLoader 
      className='loading'
      color='#ffff'
      size={70}
      />
    </div>
    :
      <div className={back}>
        {closeError ? <Error error={error} /> : ''}
        <div className='Container'>
          <div className='search'>
            <span id='title'>Confira o clima da sua cidade:</span>
            
            <div className='search-input'>

              <input 
              type="text"
              title='Digite o nome da cidade'
              placeholder='Digite o nome da cidade'
              autoComplete='none'
              onChange={handleChange}
              value={city}
              onKeyDown={(e)=>{
                if(e.key === 'Enter'){
                  search()
                }
              }}
              />

              <button
              title='Perquisar'
              onClick={search}
              disabled={!city.trim()}
              >
                <i><FaSearch/></i>
              </button>
            </div>

            <hr/>

            {loading ? 
            <ClipLoader 
              className='loading'
              color='#ffff'
              size={50}
            /> : ''}

            {viewData && !loading 
            ? 
            <div className='location'>

              <span> 
                <i><ImLocation/></i>{dataCity.name}
              </span>

              <img src={"https://www.countryflagicons.com/FLAT/32/"+dataCity.sys.country+".png"} alt='Bandeira do país'></img>
            
            </div>
            : ''}

              {viewData && !loading ? 
            <div className='climate'>

              <div className='temperature'>
                <label>{parseInt(dataCity.main.temp)-273}<span id='grau'>°c</span> </label>
                <span>{dataCity.weather[0].description}</span>
              </div>

              <div className='climate-icon'>
                <img src={"https://openweathermap.org/img/wn/"+dataCity.weather[0].icon+".png"} alt="Clima" title={'ícone de '+dataCity.weather[0].description}></img>
              </div>

            </div>
            : '' }

            {viewData && !loading ? 
            <div className='wind-cloud'>

              <div className='wind'>
                <label><i> <FaWind /> </i> {(dataCity.wind.speed * 3.6).toFixed(2)} Km/h</label>
                <span>Velocidade do vento</span>
              </div>

              <div className='cloud'>
                <label><i> <SiRainmeter /> </i> {dataCity.clouds.all}%</label>
                <span>Nebulosidade</span>
              </div>

            </div>
            : '' }
          </div>
        </div>
      </div>
      }
      </>
  );
}

export default App;
