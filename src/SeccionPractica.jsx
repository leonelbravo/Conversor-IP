import { useState } from 'react'
import './SeccionPractica.css'

const MODES = {
  OCTET: 'octet',
  CIDR_MASK: 'cidrMask',
  NETWORK: 'network',
}

const modeLabels = {
  [MODES.OCTET]: 'Modo Octeto (Fácil)',
  [MODES.CIDR_MASK]: 'Modo CIDR a Máscara (Medio)',
  [MODES.NETWORK]: 'Modo Dirección de Red (Difícil)',
}

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const toBinary8 = (value) => value.toString(2).padStart(8, '0')

const cidrToMask = (prefix) => {
  let remaining = prefix
  const parts = [0, 0, 0, 0]

  for (let i = 0; i < 4; i += 1) {
    if (remaining >= 8) {
      parts[i] = 255
      remaining -= 8
    } else if (remaining > 0) {
      parts[i] = (0xff << (8 - remaining)) & 0xff
      remaining = 0
    }
  }

  return parts.join('.')
}

const ipToInt = (ip) => ip
  .split('.')
  .reduce((acc, octet) => (acc << 8) | Number(octet), 0) >>> 0

const intToIp = (intValue) => [
  (intValue >>> 24) & 0xff,
  (intValue >>> 16) & 0xff,
  (intValue >>> 8) & 0xff,
  intValue & 0xff,
].join('.')

const generateRandomIp = () => Array.from({ length: 4 }, () => randomInt(0, 255)).join('.')

const generateExercise = (mode) => {
  if (mode === MODES.OCTET) {
    const decimal = randomInt(0, 255)
    return {
      type: mode,
      prompt: `Convierte el número decimal ${decimal} a binario de 8 bits.`,
      answer: toBinary8(decimal),
      helper: 'Usa 8 bits y ceros a la izquierda si es necesario.',
    }
  }

  if (mode === MODES.CIDR_MASK) {
    const prefix = randomInt(8, 30)
    return {
      type: mode,
      prompt: `Convierte el prefijo CIDR /${prefix} a máscara de red en formato decimal con puntos.`,
      answer: cidrToMask(prefix),
      helper: 'Ej: /24 → 255.255.255.0',
    }
  }

  const prefix = randomInt(8, 30)
  const ip = generateRandomIp()
  const maskInt = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0
  const network = intToIp(ipToInt(ip) & maskInt)

  return {
    type: mode,
    prompt: `Calcula la dirección de red para ${ip} /${prefix}.`,
    answer: network,
    helper: 'Escribe la dirección de red resultante en formato IPv4.',
  }
}

const validateIPv4 = (ip) => {
  const trimmed = ip.trim()
  const match = /^([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/.exec(trimmed)
  if (!match) return false
  return [1, 2, 3, 4].every((index) => {
    const value = Number(match[index])
    return Number.isInteger(value) && value >= 0 && value <= 255
  })
}

function SeccionPractica() {
  const [mode, setMode] = useState(MODES.OCTET)
  const [exercise, setExercise] = useState(() => generateExercise(MODES.OCTET))
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState({ status: '', message: '' })
  const [streak, setStreak] = useState(0)

  const resetExercise = (newMode = mode) => {
    setExercise(generateExercise(newMode))
    setUserAnswer('')
    setFeedback({ status: '', message: '' })
  }

  const handleModeChange = (nextMode) => {
    if (nextMode === mode) return
    setMode(nextMode)
    resetExercise(nextMode)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmedAnswer = userAnswer.trim()

    if (!trimmedAnswer) {
      setFeedback({ status: 'error', message: 'Por favor ingresa una respuesta antes de validar.' })
      return
    }

    let isCorrect = false
    let correctAnswer = exercise.answer

    if (exercise.type === MODES.OCTET) {
      const cleaned = trimmedAnswer.replace(/\s+/g, '')
      if (!/^[01]{1,8}$/.test(cleaned)) {
        setFeedback({ status: 'error', message: 'Ingresa un valor binario válido de 1 a 8 dígitos.' })
        return
      }
      isCorrect = cleaned.padStart(8, '0') === exercise.answer
      correctAnswer = exercise.answer
    }

    if (exercise.type === MODES.CIDR_MASK) {
      isCorrect = trimmedAnswer === exercise.answer
    }

    if (exercise.type === MODES.NETWORK) {
      if (!validateIPv4(trimmedAnswer)) {
        setFeedback({ status: 'error', message: 'La dirección de red debe ser una IPv4 válida.' })
        return
      }
      isCorrect = trimmedAnswer === exercise.answer
    }

    if (isCorrect) {
      setStreak((current) => current + 1)
      setFeedback({ status: 'success', message: `¡Correcto! 🎉 La respuesta es ${correctAnswer}. Generando nuevo ejercicio...` })
      resetExercise(mode)
      return
    }

    setStreak(0)
    setFeedback({ status: 'error', message: `Incorrecto ❌. La respuesta correcta es ${correctAnswer}.` })
  }

  return (
    <section className="seccion-practica">
      <div className="practice-header">
        <div>
          <h2>Práctica de IP</h2>
          <p>Elige un modo y resuelve ejercicios para mejorar tu comprensión de IPs, máscaras y direcciones de red.</p>
        </div>
        <div className="streak-badge">Racha: {streak}</div>
      </div>

      <div className="mode-tabs">
        {Object.entries(modeLabels).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`tab-btn ${mode === key ? 'active' : ''}`}
            onClick={() => handleModeChange(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="practice-card">
        <div className="prompt-label">Ejercicio</div>
        <div className="prompt-text">{exercise.prompt}</div>
        <div className="prompt-helper">{exercise.helper}</div>

        <form className="practice-form" onSubmit={handleSubmit}>
          <label htmlFor="practice-answer">Tu respuesta</label>
          <input
            id="practice-answer"
            type="text"
            value={userAnswer}
            onChange={(event) => setUserAnswer(event.target.value)}
            placeholder={
              exercise.type === MODES.OCTET
                ? 'Ej: 11010101'
                : exercise.type === MODES.CIDR_MASK
                ? 'Ej: 255.255.255.0'
                : 'Ej: 192.168.1.0'
            }
            className="practice-input"
          />

          <div className="button-row">
            <button type="submit" className="submit-btn">Validar</button>
            <button type="button" className="next-btn" onClick={() => resetExercise()}>Siguiente</button>
          </div>
        </form>

        {feedback.status && (
          <div className={`feedback ${feedback.status}`}>
            {feedback.message}
          </div>
        )}
      </div>
    </section>
  )
}

export default SeccionPractica
