import { useState } from 'react'
import './estilonuevo.css'
import imagenEsquema from './conversion-ip.png'

function App() {
  const [ipInput, setIpInput] = useState('')
  const [binaryResult, setBinaryResult] = useState('')
  const [error, setError] = useState('')
  const [infoTab, setInfoTab] = useState('ip') // Estado para los botones de abajo

  // --- LÓGICA DE VALIDACIÓN ---
  const validateIPv4 = (ip) => {
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/
    const match = ip.match(ipv4Regex)
    if (!match) return false

    for (let i = 1; i <= 4; i++) {
      const octet = parseInt(match[i], 10)
      if (octet < 0 || octet > 255) return false
    }
    return true
  }

  // --- LÓGICA DE CONVERSIÓN ---
  const convertToBinary = (ip) => {
    const octets = ip.split('.')
    const binaryOctets = octets.map(octet => {
      const num = parseInt(octet, 10)
      return num.toString(2).padStart(8, '0')
    })
    return binaryOctets.join('.')
  }

  const handleConvert = () => {
    if (!ipInput.trim()) {
      setError('Por favor ingresa una dirección IP')
      setBinaryResult('')
      return
    }

    if (!validateIPv4(ipInput)) {
      setError('Dirección IP inválida. Debe ser formato IPv4 (ej: 192.168.1.1)')
      setBinaryResult('')
      return
    }

    setError('')
    const binary = convertToBinary(ipInput)
    setBinaryResult(binary)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleConvert()
    }
  }


  return (
    <div className="app">
      <header className="header">
        <h1>Conversor IP a Binario</h1>
        <p>Convierte direcciones IPv4 a su representación binaria byte por byte</p>
      </header>

      <main className="main">
        <div className="input-section">
          <label htmlFor="ip-input">Dirección IP:</label>
          <div className="input-row">
            <input
              id="ip-input"
              type="text"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ej: 192.168.1.1"
              className="ip-input"
            />
            <button onClick={handleConvert} className="convert-btn">
              Convertir
            </button>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        {binaryResult && (
          <div className="result-section animate-fade">
            <h2>Resultado:</h2>
            <div className="binary-display">
              <div className="binary-octets">
                {binaryResult.split('.').map((octet, index) => (
                  <div key={index} className="octet">
                    <span className="octet-number">{ipInput.split('.')[index]}</span>
                    <span className="octet-binary">{octet}</span>
                  </div>
                ))}
              </div>
              <div className="binary-full">
                <strong>Binario completo:</strong> {binaryResult}
              </div>
            </div>
          </div>
        )}
      </main>

      {}
      <div className="info-controls">
        <button 
          className={`tab-btn ${infoTab === 'ip' ? 'active' : ''}`}
          onClick={() => setInfoTab('ip')}
        >
          ¿Qué es una IP?
        </button>
        <button 
          className={`tab-btn ${infoTab === 'programa' ? 'active' : ''}`}
          onClick={() => setInfoTab('programa')}
        >
          Funcionamiento
        </button>
      </div>

      {}
      <section className="info-section">
        {infoTab === 'ip' ? (
          <div className="info-content animate-fade">
            <h2 className="info-title">¿Qué son las Direcciones IP?</h2>
            <p>
            Una dirección IP (Protocolo de Internet) es un identificador numérico único que se le asigna a cada dispositivo conectado a una red que utiliza el protocolo de internet, como computadoras, celulares, tablets, servidores, entre otros. Su función principal es permitir la identificación y localización de los dispositivos dentro de una red, haciendo posible que se comuniquen entre sí y puedan intercambiar información.

Una dirección IP no es solo un número al azar, sino que tiene una estructura definida. En el caso más común (IPv4), está formada por cuatro números separados por puntos, donde cada uno puede tomar valores entre 0 y 255. Cada uno de estos números representa un conjunto de 8 bits (un byte), por lo que una dirección IP completa tiene 32 bits en total. Esta estructura permite dividir la dirección en dos partes: una que identifica la red a la que pertenece el dispositivo y otra que identifica específicamente al dispositivo dentro de esa red.

El funcionamiento de la dirección IP es clave en la comunicación en internet. Cuando un dispositivo quiere enviar información (por ejemplo, al ingresar a una página web), utiliza la dirección IP del servidor al que quiere acceder. Los datos viajan a través de diferentes redes y dispositivos intermedios (como routers), que utilizan esas direcciones IP para enrutar correctamente la información hasta su destino. De la misma forma, el servidor responde enviando los datos de vuelta a la dirección IP del dispositivo que hizo la solicitud.

Además, existen distintos tipos de direcciones IP. Por ejemplo, pueden ser públicas (visibles en internet) o privadas (usadas dentro de redes locales como las de una casa o escuela). También pueden ser estáticas (no cambian) o dinámicas (se asignan automáticamente y pueden variar con el tiempo).

En resumen, la dirección IP es un elemento fundamental para el funcionamiento de cualquier red, ya que actúa como una especie de “dirección digital” que permite identificar dispositivos, ubicarlos y garantizar que la información llegue correctamente de un punto a otro.
            </p>
          </div>
        ) : (
<div className="info-content animate-fade">
  <h2 className="info-title">Funcionamiento del covertidor ip a Binario </h2>
  <div className="info-container">
    <div className="info-image-container">
      <img 
        src={imagenEsquema} 
        alt="Esquema de conversión" 
        className="info-image" 
      />
              </div>
              <div className="text-block">
                <p>
                Un convertidor transforma una dirección en formato decimal a sistema binario, que es el lenguaje que utilizan las computadoras. Para hacerlo, toma cada número y lo convierte de 
                base 10 (decimal) a base 2 (binario). Esta conversión se realiza mediante un procedimiento matemático basado en divisiones sucesivas por 2: se divide el número, se guarda el
                resto (que puede ser 0 o 1) y se repite el proceso hasta llegar a 0. Luego, los restos obtenidos se leen en orden inverso para formar el número en binario.

Una vez obtenido el resultado, se ajusta para que tenga una longitud fija de 8 bits, agregando ceros a la izquierda si es necesario. Finalmente, todos los valores en binario se combinan en una 
sola secuencia continua. Este proceso es importante porque, aunque las personas utilizan el sistema decimal, las computadoras trabajan internamente con bits (0 y 1),
por lo que esta conversión permite representar la información en un formato que la máquina puede interpretar.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default App