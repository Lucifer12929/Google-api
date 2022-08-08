import {
  Button,
  SkeletonText,
 
} from '@chakra-ui/react'
import './App.css'
import marker from "./Image/marker.png";
import logo from "./Image/logo.png";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api'
import { useRef, useState } from 'react'

const center = { lat: 48.8584, lng: 2.2945 }

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  })

  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef()

  if (!isLoaded) {
    return <SkeletonText />
  }

  async function calculateRoute() {
    if (originRef.current.value === '' || destiantionRef.current.value === '') {
      return
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    })
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
  }

  

  return (
     <div className='App'>

      <div className='Navbar'>
      <img src={logo} alt="Logo" className="logo" />
      </div>

      <div className='Heading'>
      Let's calculate <span className="bold">distance</span> from Google
          maps
      </div>

      <div className='main_body'>
        <div className='main_container'>

        <div className='body_left'>
          <div className='flex-box'>
          <div className='input_field'>
            <h1>Origin</h1>
           <div className='input_box'>
           
           <img className="marker" src={marker} alt="marker" />
           
            <Autocomplete>
              <input type='text' placeholder='Origin' ref={originRef} className='input'/>
            </Autocomplete>
            
            </div>

            <h1>Destination</h1>
            <div className='input_box'>
            <img className="marker" src={marker} alt="marker" />
            <Autocomplete>
              <input
                type='text'
                placeholder='Destination'
                ref={destiantionRef}
                className='input'
              />
              </Autocomplete>
          </div>
          </div>
          <div className='button_field'>
        <div className='cal_button'>
            <button className='button1'  type='submit' onClick={calculateRoute}>
              Calculate
            </button>
             </div>
          </div>
          </div>
         <div className='bottom_card'>
          <div className='distance_cal'>
             <div className='cal1'>Distance:</div>
             <div className='cal2'>{!(distance=='') ? <p>{distance}</p>:<p>0 km</p>}</div>
           </div>
           {!(distance=='') ? 
              <h4 className="output-text">
                The distance between <span className="bold">{originRef.current.value}</span> and{" "}
                <span className="bold">{destiantionRef.current.value}</span> is{" "}
                <span className="bold">{distance}</span>.
              </h4>
            :
            <h4 className="output-text">
                The distance between <span className="bold">Origin</span> and{" "}
                <span className="bold">Destination</span> is{" "}
                <span className="bold">0 km</span>.
              </h4>}
          </div>

        
        {/* <div className='button_field'>
        <div className='cal_button'>
            <button className='button1'  type='submit' onClick={calculateRoute}>
              Calculate
            </button>
             </div>
          </div> */}
        </div>

        <div className='body_right'>
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={map => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
        </div>
        </div>
        </div>
    </div>
  )
}

export default App
