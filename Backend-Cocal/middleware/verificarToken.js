import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export function verificarToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ message: 'Token no proporcionado.' })
    }
    const token = authHeader.split(' ')[1]
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        console.log('Token expirado detectado en backend')
        return res.status(401).json({ message: 'El token ha expirado. Inicia sesión nuevamente.' })
      }
      console.log('Token inválido:', err.message)
      return res.status(401).json({ message: 'Token inválido o ausente.' })
    }

    
    const ahora = Date.now()
    const ultimaActividad = decoded.ultimaActividad || ahora
    const tiempoInactivo = (ahora - ultimaActividad) / 1000 / 60 // en minutos
    const LIMITE_INACTIVIDAD = 120

    if (tiempoInactivo > LIMITE_INACTIVIDAD) {
      console.log('Token expirado por inactividad')
      return res.status(440).json({
        message: ' Sesión expirada por inactividad. Vuelve a iniciar sesión.',
      })
    }

    
    decoded.ultimaActividad = ahora
    req.user = decoded
    next()
  } catch (err) {
    console.error('Error en verificarToken:', err.message)
    return res.status(401).json({ message: 'Token inválido o ausente.' })
  }
}
