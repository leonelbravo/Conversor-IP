import { useState } from 'react'
import './estilonuevo.css'

function App() {
  const [ipInput, setIpInput] = useState('')
  const [binaryResult, setBinaryResult] = useState('')
  const [error, setError] = useState('')

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

        {error && <div className="error">{error}</div>}

        {binaryResult && (
          <div className="result-section">
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
    </div>
  )
}

export default App
