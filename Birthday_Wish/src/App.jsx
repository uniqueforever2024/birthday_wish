import { useEffect, useRef, useState } from 'react'
import './App.css'
import thankYouMelody from "./assets/Tujhe Dekha To Ye Jana Sanam - Bgm _ Instrumental.wav"
import countdownBeep from './assets/countdown-beep.wav'

const crackerBursts = [
  { x: '8%', y: '12%', delay: 0 },
  { x: '22%', y: '8%', delay: 0.3 },
  { x: '35%', y: '18%', delay: 0.6 },
  { x: '65%', y: '10%', delay: 0.8 },
  { x: '80%', y: '15%', delay: 1 },
  { x: '12%', y: '40%', delay: 0.4 },
  { x: '28%', y: '55%', delay: 0.9 },
  { x: '50%', y: '35%', delay: 1.1 },
  { x: '72%', y: '45%', delay: 0.5 },
  { x: '85%', y: '35%', delay: 1.3 },
  { x: '18%', y: '70%', delay: 1.2 },
  { x: '40%', y: '78%', delay: 0.7 },
  { x: '63%', y: '68%', delay: 1.4 },
  { x: '82%', y: '72%', delay: 1.6 }
]

const confettiPieces = Array.from({ length: 14 })
const lanterns = Array.from({ length: 6 })

const TeddyBear = ({ side }) => (
  <svg
    className={`teddy ${side}`}
    data-side={side}
    viewBox="0 0 200 240"
    role="img"
    aria-label="Cute teddy bear ready for a hug"
  >
    <title>Adorable teddy bear</title>
    <circle className="ear" cx="55" cy="60" r="32" />
    <circle className="ear" cx="145" cy="60" r="32" />
    <circle className="ear-inner" cx="55" cy="60" r="18" />
    <circle className="ear-inner" cx="145" cy="60" r="18" />
    <circle className="head" cx="100" cy="90" r="60" />
    <ellipse className="snout" cx="100" cy="120" rx="34" ry="26" />
    <circle className="nose" cx="100" cy="115" r="9" />
    <path className="smile" d="M80 135 Q100 150 120 135" />
    <circle className="eye" cx="80" cy="105" r="6" />
    <circle className="eye" cx="120" cy="105" r="6" />
    <ellipse className="blush" cx="70" cy="125" rx="9" ry="6" />
    <ellipse className="blush" cx="130" cy="125" rx="9" ry="6" />
    <ellipse className="body" cx="100" cy="170" rx="70" ry="80" />
    <ellipse className="belly" cx="100" cy="175" rx="48" ry="58" />
    <ellipse
      className="arm arm-left"
      cx="40"
      cy="150"
      rx="26"
      ry="50"
      transform="rotate(-20 40 150)"
    />
    <ellipse
      className="arm arm-right"
      cx="160"
      cy="150"
      rx="26"
      ry="50"
      transform="rotate(20 160 150)"
    />
    <ellipse className="leg leg-left" cx="70" cy="225" rx="32" ry="22" />
    <ellipse className="leg leg-right" cx="130" cy="225" rx="32" ry="22" />
    <path className="heart" d="M100 165 C100 145 132 145 132 167 C132 190 100 205 100 225 C100 205 68 190 68 167 C68 145 100 145 100 165 Z" />
  </svg>
)

function App() {
  const [hasCelebrated, setHasCelebrated] = useState(false)
  const [celebrationPulse, setCelebrationPulse] = useState(0)
  const [countdown, setCountdown] = useState(10)
  const [hasCountdownStarted, setHasCountdownStarted] = useState(false)
  const [hasCountdownFinished, setHasCountdownFinished] = useState(false)
  const [hasStartedBeep, setHasStartedBeep] = useState(false)
  const audioRef = useRef(null)
  const beepAudioRef = useRef(null)

  useEffect(() => {
    const beep = beepAudioRef.current
    if (!hasCountdownStarted) {
      if (beep) {
        beep.pause()
        beep.currentTime = 0
      }
      return
    }

    if (!hasCountdownFinished && !hasStartedBeep && beep) {
      try {
        beep.currentTime = 0
        const promise = beep.play()
        if (promise && typeof promise.then === 'function') {
          promise.catch(() => {
            /* autoplay could be blocked until interaction */
          })
        }
      } catch {
        /* ignore beep errors */
      }
      setHasStartedBeep(true)
    }

    if (hasCountdownFinished) {
      if (beep) {
        beep.pause()
        beep.currentTime = 0
      }
      return undefined
    }

    if (countdown <= 0) {
      const doneTimer = setTimeout(() => setHasCountdownFinished(true), 500)
      return () => clearTimeout(doneTimer)
    }

    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000)
    return () => clearTimeout(timer)
  }, [hasCountdownStarted, countdown, hasCountdownFinished, hasStartedBeep])

  const playSong = () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      audio.currentTime = 0
      audio.play().catch(() => {
        /* ignore autoplay rejections */
      })
    } catch {
      /* playback errors can be ignored silently */
    }
  }

  const handleThankYouClick = () => {
    if (!hasCountdownFinished) {
      return
    }

    if (hasCelebrated) {
      setHasCelebrated(false)
      const audio = audioRef.current
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
      return
    }

    setHasCelebrated(true)
    setCelebrationPulse((count) => count + 1)
    playSong()
  }

  const handleCountdownStart = () => {
    if (hasCountdownStarted) return
    setHasCountdownStarted(true)
    setHasCountdownFinished(false)
    setHasStartedBeep(false)
    setCountdown(10)
  }

  return (
    <div className={`app ${hasCelebrated ? 'is-party' : 'awaiting'}`}>
      <audio ref={audioRef} src={thankYouMelody} preload="auto" loop />
      <audio ref={beepAudioRef} src={countdownBeep} preload="auto" />

      {!hasCelebrated && hasCountdownFinished && (
        <div className="floating-confetti" aria-hidden="true">
          {confettiPieces.map((_, index) => (
            <span key={`confetti-${index}`} style={{ '--i': index }} />
          ))}
        </div>
      )}

      {hasCountdownFinished && (
        <div className="lantern-sky" aria-hidden="true">
          {lanterns.map((_, index) => (
            <span key={`lantern-${index}`} className="lantern" style={{ '--i': index }} />
          ))}
        </div>
      )}

      {!hasCountdownStarted && (
        <div className="start-overlay">
          <div className="start-card">
            <p>Press to light the countdown</p>
            <button onClick={handleCountdownStart}>Start the magic</button>
          </div>
        </div>
      )}

      {hasCountdownStarted && !hasCountdownFinished && (
        <div className="countdown-overlay">
          <div className="countdown-circle">
            <span className="countdown-number">{countdown}</span>
          </div>
        </div>
      )}

      {hasCountdownFinished && (
        <>
          {hasCelebrated && (
            <>
              <div className="aurora aurora-one" aria-hidden="true" />
              <div className="aurora aurora-two" aria-hidden="true" />
              <div className="cracker-field" aria-hidden="true" key={celebrationPulse}>
                {crackerBursts.map(({ x, y, delay }, index) => (
                  <span
                    key={`${index}-${x}-${y}-${celebrationPulse}`}
                    className="cracker"
                    style={{
                      '--x': x,
                      '--y': y,
                      '--delay': `${delay}s`
                    }}
                  >
                    <span className="ember ember-one" aria-hidden="true" />
                    <span className="ember ember-two" aria-hidden="true" />
                    <span className="ember ember-three" aria-hidden="true" />
                  </span>
                ))}
              </div>
            </>
          )}

          <main className="center-stage">
            {hasCelebrated ? (
              <>
                <p className="eyebrow">Mamuni, you are my miracle</p>
                <h1 className="glow-text">Happy Birthday Mamuni</h1>
                <p className="subtitle">
                  Every crackle, every violin, every heartbeat in this tune is me squeezing you tight and saying thank you for saving me a thousand times.
                </p>
                <div className="teddy-stage hugging" key={`teddy-${celebrationPulse}`}>
                  <TeddyBear side="left" />
                  <div className="glow-heart" aria-hidden="true" />
                  <TeddyBear side="right" />
                </div>
                <article className="message-card">
                  <p>Dear Mamuni,</p>
                  <p>
                    You have held my mind steady when it was shaking, listened to every tangled thought, and loved me in every messy season. Mentally, emotionally, spiritually, you have carried me when I forgot how to stand.
                  </p>
                  <p>
                    Day to day meets, the stories of Back Gate Forest Park, the Lingaraj Road wanderings, the cute fights, the careless me, the car drives, and of course Moon Momos always remind us of pep talks, teary calls, goofy reels, and every etc etc moment that stitched my heart back together.
                  </p>
                  <p>
                    I wish you all the best for your future. You are the strongest girl I know, carrying a thousand dreams in your eyes, holding your family&apos;s feelings together, and still shining with a soft heart. Life may pull us onto different paths, but I always want to see you succeed in everything you desire.
                  </p>
                  <p>
                    Thank you, chocolate hater.
                  </p>
                  <p className="signature">&mdash; Forever your endlessly grateful human</p>
                </article>
                <button className="hug-button" onClick={handleThankYouClick}>
                  Thank you again!
                </button>
              </>
            ) : (
              <>
                <h1 className="awaiting-heading glow-text">Happy Birthday Mamuni</h1>
                <p className="landing-tagline">
                  Tap this thank you button and let the roses, cakes, hugs, and fireworks bloom for you.
                </p>
                <div className="landing-decor" aria-hidden="true">
                  <div className="decor-card decor-gift">
                    <div className="decor-icon gift-box">
                      <span className="gift-lid" />
                      <span className="gift-ribbon horizontal" />
                      <span className="gift-ribbon vertical" />
                      <span className="gift-tag">M</span>
                    </div>
                    <p>Gifts waiting</p>
                  </div>
                  <div className="decor-card decor-rose">
                    <div className="decor-icon rose-bloom">
                      <span className="petal petal-one" />
                      <span className="petal petal-two" />
                      <span className="petal petal-three" />
                      <span className="rose-core" />
                      <span className="rose-stem" />
                      <span className="rose-leaf leaf-left" />
                      <span className="rose-leaf leaf-right" />
                    </div>
                    <p>Roses for your smile</p>
                  </div>
                  <div className="decor-card decor-cake">
                    <div className="decor-icon cake-tier">
                      <span className="cake-layer layer-base" />
                      <span className="cake-layer layer-middle" />
                      <span className="cake-layer layer-top" />
                      <span className="frosting drip-left" />
                      <span className="frosting drip-right" />
                      <div className="cake-candles">
                        <span className="cake-candle">
                          <span className="flame" />
                        </span>
                        <span className="cake-candle">
                          <span className="flame" />
                        </span>
                        <span className="cake-candle">
                          <span className="flame" />
                        </span>
                      </div>
                    </div>
                    <p>Cake and melodies</p>
                  </div>
                  <div className="decor-card decor-candle">
                    <div className="decor-icon candle-field">
                      <span className="solo-candle">
                        <span className="flame" />
                      </span>
                      <span className="solo-candle tall">
                        <span className="flame" />
                      </span>
                      <span className="solo-candle short">
                        <span className="flame" />
                      </span>
                    </div>
                    <p>Wishful candles</p>
                  </div>
                </div>
                <button className="hug-button huge" onClick={handleThankYouClick}>
                  Thank you!
                </button>
              </>
            )}
          </main>
        </>
      )}
    </div>
  )
}

export default App
