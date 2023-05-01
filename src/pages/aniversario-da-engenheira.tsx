import { ChangeEvent, ReactNode, useEffect, useRef, useState } from "react"
import styles from "../styles/404.module.css"
import { Decode } from "@/utils/encription"
import { sleep } from "@/utils/sleep.util"
import { getRandomNum } from "@/utils/random.util"

const rainParticleCount: number = 20

const balloons = [
  "blue_2",
  "blue",
  "green",
  "purple",
  "red",
  "yellow",
]

export default function AniversarioDaGata() {
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [secret, setSecret] = useState('')
  const [hashedMessage, setHashedMessage] = useState('')
  const [typing, setTyping] = useState(false)
  const [rainParticles, setRainParticles] = useState<ReactNode[]>([])
  const ongoingRain = useRef(false)
  const rainTrigger = useRef("")
  const debounceRef = useRef<NodeJS.Timeout>()

  const startBallons = () => {
    ongoingRain.current = true
    renderRain()
  }

  const renderRainParticles = () => {
    const newRainParticles: ReactNode[] = []
    for (let i = 0; i < rainParticleCount; i++) {
      const randomBalloon = balloons[Math.floor(Math.random() * 6)]
      newRainParticles.push(
        <div className={styles.rainParticle} id={`rainParticle${i}`} key={i}>
          <img className={styles.ballon} src={`/balloons/balloon_${randomBalloon}.png`} />
        </div>
      )
    }
    newRainParticles.push(
      <div className={styles.rainParticle} id={`rainParticle${rainParticleCount}`} key={rainParticleCount}>
        <img className={styles.ballon} src={`/balloons/cat.png`} />
      </div>
    )
    setRainParticles(newRainParticles)
  }

  const renderRain = async () => {
    const rainParticlesRefs: HTMLElement[] = []
    let i: number, particle
    for (i = 0; i <= rainParticleCount; i++) {
      particle = document.getElementById(`rainParticle${i}`)
      if (particle === null) {
        rainTrigger.current += "a"
        return
      }
      rainParticlesRefs.push(particle)
      particle.style.top = `${window.innerHeight}px`
      particle.style.visibility = "visible"
    }

    let randomLeft, randomDelay
    while (ongoingRain.current) {
      for (i = 0; i < rainParticlesRefs.length; i++) {
        if (!ongoingRain.current) return
        const curr = rainParticlesRefs[i]
        if (curr.offsetTop < window.innerHeight && curr.offsetTop > 0) {
          await sleep(100)
          continue
        }
        randomDelay = getRandomNum(500, 1000)
        await sleep(randomDelay)
        randomLeft = getRandomNum(0, window.innerWidth)
        curr.style.left = `${randomLeft}px`
        curr.style.transition = "top 10000ms linear"
        curr.style.top = "-100px"
        setTimeout(() => {
          curr.style.transition = "none"
          curr.style.top = `${window.innerHeight}px`
        }, 10000)
      }
    }
  }

  const submit = () => {
    if (!hashedMessage.trim()) return
    try {
      const message = Decode(hashedMessage, secret.toLowerCase().replace(/\s/g, ''))
      setMessage(message)
      setShowModal(true)
    } catch {
      setMessage("Mensagem inválida")
      setShowModal(true)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setMessage("")
  }

  const secretType = (e: ChangeEvent<HTMLInputElement>) => {
    setSecret(e.target.value)
    if (debounceRef.current)
      clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setTyping(false)
    }, 1000)
    setTyping(true)
  }

  const onTip = () => {
    setMessage("midwich")
    setShowModal(true)
  }

  useEffect(() => {
    renderRainParticles()
  }, [])

  useEffect(() => {
    if (!ongoingRain.current && rainParticles.length)
      startBallons()
  }, [rainParticles])

  return (
    <div className={styles.container} style={{flexDirection: "column"}}>
      <div className={styles.form}>
        <label className={styles.label}>
          Segredo<a className={styles.tip}>(Obs.: O segredo é composto de duas palavras que começam com as letras que você achou!) <a className={styles.tip2} onClick={onTip}>[Dica]</a></a>
          <img src={typing ? "/cuts/down_2.png" : "/cuts/thinking.png"} className={styles.thinkingImg} />
        </label>
        <input className={styles.label} type="text" value={secret} onChange={secretType} />
        <label className={styles.label} style={{marginTop: 20}}>
          Mensagem criptografada
        </label>
        <textarea style={{width: "80vw", height: "40vh"}} value={hashedMessage} onChange={(e) => setHashedMessage(e.target.value)} />
        <input type="submit" className={styles.submit} onClick={submit} />
      </div>
      <div className={styles.backdrop} onClick={closeModal} style={{ pointerEvents: showModal ? 'auto' : 'none', opacity: showModal ? '1' : '0' }}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          {message}
        </div>
      </div>
      <img src="/cuts/right.png" className={styles.leftImg} />
      <img src="/cuts/up.png" className={styles.upImg} />
      <img src="/cuts/left.png" className={styles.rightImg} />
      <div className={styles.rainContainer}>
        {rainParticles}
      </div>
    </div>
  )
}
