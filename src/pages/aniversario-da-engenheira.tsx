import { ChangeEvent, useRef, useState } from "react"
import styles from "../styles/404.module.css"
import { Decode } from "@/utils/encription"

export default function AniversarioDaGata() {
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [secret, setSecret] = useState('')
  const [hashedMessage, setHashedMessage] = useState('')
  const [typing, setTyping] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout>()

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
    </div>
  )
}
