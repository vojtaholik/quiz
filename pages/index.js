import Head from 'next/head'
import Link from 'next/link'
// import {first, indexOf, find, get} from 'lodash'
// import {useMachine} from '@xstate/react'
// import {quizMachine} from 'machines/quizMachine'

import MockData from 'data/quizzes'
import {createServer} from 'miragejs'

import useEggheadQuizMachine from 'hooks/useEggheadQuizMachine'

createServer({
  routes() {
    this.get('/api/quiz', () => MockData)
    this.passthrough()
  },
})

export default function Home() {
  const {
    currentQuestion,
    nextQuestionId,
    handleContinue,
    handleSubmit,
    state,
    send,
  } = useEggheadQuizMachine(
    'demo', // quiz slug
  )

  console.log(nextQuestionId)

  console.log(state)

  return (
    <div className="container">
      <Head>
        <title>Quiz Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <form>
          {state.matches('initializing') ? (
            'loading...'
          ) : (
            <>
              <div>
                {/* {questions.map((question) => (
                <div key={question.id}>{question.text}</div>
              ))} */}
                {currentQuestion && currentQuestion.text}
              </div>
              {state.matches('answered') ? (
                <button type="button" onClick={handleContinue}>
                  continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => send('SUBMIT', {answer: 'my answer'})}
                >
                  submit
                </button>
              )}
            </>
          )}
        </form>

        <div style={{opacity: 0.2}}>
          <Link href={'/[slug]'} as="/demo">
            <a>
              <h3>Quiz Demo</h3>
            </a>
          </Link>
          <button onClick={() => send('START_QUIZ')}>Start</button>
        </div>
      </main>
    </div>
  )
}
