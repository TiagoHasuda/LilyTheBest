import { ReactNode, useEffect, useRef, useState } from "react"
import styles from '../styles/presente.module.css'
import { sleep } from "@/utils/sleep.util";
import { getRandomNum } from "@/utils/random.util";
import ConfettiExplosion from 'react-confetti-explosion';

const questions = [
    {
        question: '',
        options: [],
        answer: -1,
    },
    {
        question: 'Você é',
        options: [
            'Ok',
            'Brilhante',
            'Comum',
            'Nenhuma das anteriores',
        ],
        answer: 1,
    },
    {
        question: 'Se você tivesse nascido no Reino Unido, você seria',
        options: [
            'Limpadora de chaminés',
            'Carpinteira',
            'Gari',
            'Rainha',
        ],
        answer: 3,
    },
    {
        question: 'Dentre todos os seres humanos na terra, você é',
        options: [
            'Mais um ser humano',
            'Normal',
            'Única',
            'Mortal',
        ],
        answer: 2,
    },
    {
        question: 'Quantos segundos da sua vida você não foi uma Deusa?',
        options: [
            '5 segundos',
            'Nenhum',
            '0.001 segundo',
            '1 segundo',
        ],
        answer: 1,
    },
    {
        question: 'Se você me perguntasse (Tiago), eu diria que você é uma',
        options: [
            'Alienígena',
            'Torta de frango',
            'Jabuticaba',
            'Obra de arte',
        ],
        answer: 3,
    },
    {
        question: 'Sempre que você acorda, você está',
        options: [
            'Maravilhosa',
            'Pulando corda',
            'Tomando banho',
            'Jogando basquete',
        ],
        answer: 0,
    },
    {
        question: 'Quando você faz qualquer coisa, você é',
        options: [
            'Desleixada',
            'Atenciosa aos detalhes',
            'Raivosa',
            'Um saco de batata',
        ],
        answer: 1,
    },
    {
        question: 'Sempre que eu te vejo, você está',
        options: [
            'Com preguiça',
            'Correndo',
            'Voando',
            'Radiante',
        ],
        answer: 3,
    },
    {
        question: 'Quando que você fica a pessoa mais linda desse planeta?',
        options: [
            'No ano novo',
            'Às vezes',
            'Sempre',
            'Dia 1 de Maio',
        ],
        answer: 2,
    },
]

const rainParticleCount: number = 20
const balloons = [
    "blue_2",
    "blue",
    "green",
    "purple",
    "red",
    "yellow",
  ]

const incorrectLabel = ' (resposta errada)';
const fullAnswer = 'BrunoMars';
const beforePause = 'Parabéns!!!!';
const afterPause = ' Você ganhou um ingresso para o show do ';
const afterAnswer = ' dia 3 de setembro no The Town!';

export default function Aniversario() {
    const [currQuestion, setCurrQuestion] = useState(1);
    const [answer, setAnwser] = useState('_____ ____');
    const [rainParticles, setRainParticles] = useState<ReactNode[]>([])
    const [finished, setFinished] = useState(false);
    const [confettiExplosion, setConfettiExplosion] = useState(false);
    const ongoingRain = useRef(false)
    const rainTrigger = useRef("")

    const optionClick = async (id: string) => {
        const rawId = parseInt(id.replace(/\D+_(\d+)/, '$1'));
        const opt = document.getElementById(id) as HTMLDivElement;
        const questionContainer = document.getElementById('questionContainer') as HTMLDivElement;
        const answerDiv = document.getElementById('answer') as HTMLDivElement;
        if (!opt.children || !questionContainer || !answerDiv) return;
        const lbl = opt.children[1] as HTMLLabelElement;
        const radio = opt.children[0] as HTMLInputElement;
        if (questions[currQuestion].answer !== rawId) {
            wrongAnswerTrigger(opt, lbl, radio);
        } else {
            setAnwser(answer.replace(/([^_]*)_{1}(_*)/, `$1${fullAnswer[currQuestion - 1]}$2`))
            const currQ = currQuestion
            questionContainer.style.opacity = '0';
            await sleep(400)
            setCurrQuestion(0)
            await sleep(10)
            if (questions.length > currQuestion + 1) {
                setCurrQuestion(currQ + 1)
                questionContainer.style.opacity = '1';
            } else {
                questionContainer.style.display = 'none';
                let i = 0;
                let beforeMessage = '';
                setConfettiExplosion(true)
                for (i = 0; i < beforePause.length; i++) {
                    beforeMessage += beforePause[i];
                    answerDiv.innerHTML = beforeMessage + 'Bruno Mars';
                    await sleep(50);
                }
                setFinished(true)
                renderRainParticles()
                await sleep(500);
                for (i = 0; i < afterPause.length; i++) {
                    beforeMessage += afterPause[i];
                    answerDiv.innerHTML = beforeMessage + 'Bruno Mars';
                    await sleep(50);
                }
                for (i = 0; i < afterAnswer.length; i++) {
                    answerDiv.innerHTML += afterAnswer[i];
                    await sleep(50);
                }
            }
        }
    }

    const wrongAnswerTrigger = async (div: HTMLDivElement, lbl: HTMLLabelElement, radio: HTMLInputElement) => {
        div.style.pointerEvents = 'none';
        div.style.color = 'gray';
        div.style.textDecoration = 'line-through';
        radio.checked = false;
        for (let i = 0; i < incorrectLabel.length; i++) {
            lbl.innerHTML += incorrectLabel[i];
            await sleep(50);
        }
    }

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
  
    useEffect(() => {
      if (!ongoingRain.current && rainParticles.length)
        startBallons()
    }, [rainParticles])

    return (
        <div className={styles.container}>
            <div className={styles.answer} id='answer'>{answer}</div>
            <div id='questionContainer' className={styles.questionContainer}>
                <div className={styles.question}>{questions[currQuestion].question}</div>
                {questions[currQuestion].options.map((opt, index) => <div id={`opt_${index}`} className={styles.optionContainer} key={index}>
                    <input name='option' type="radio" id={`radio_${index}`} className={styles.option} value={index} onClick={() => optionClick(`opt_${index}`)} />
                    <label htmlFor={`radio_${index}`}>{opt}</label>
                </div>
                )}
            </div>
            {finished &&
                <div className={styles.rainContainer}>
                    {rainParticles}
                </div>
            }
            {confettiExplosion && <ConfettiExplosion duration={5000} height={1800} particleCount={200} />}
        </div>
    )
}
