import styles from "../styles/404.module.css"

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        Encontre as duas letras que completam o caminho:
        <div className={styles.link}>lilythebest.com/_niversario-da-en_enheira</div>
      </div>
      <div className={styles.fileLabel}>
        Você vai precisar <a href='/mensagem.txt' target="_blank" className={styles.message}>disso</a>
        <img src="/cuts/here.png" className={styles.hereImg} />
      </div>
    </div>
  )
}
