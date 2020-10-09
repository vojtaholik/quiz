import {createMachine, assign} from 'xstate'
import {get, find, first, filter, isEmpty} from 'lodash'
import {fetchQuizData} from 'utils/fetchQuizData'

export const quizMachine = createMachine(
  {
    id: 'quiz',
    initial: 'initializing',
    context: {
      questions: null,
      currentQuestionId: '1',
      answers: [],
      slug: null,
    },
    states: {
      initializing: {
        invoke: {
          id: 'fetch-questions',
          src: 'fetchQuizData',
          onDone: {
            target: 'idle',
            actions: assign({
              questions: (context, event) => {
                const {data} = event
                console.log({data})
                const questions = get(
                  first(filter(data, (quiz) => quiz.slug === context.slug)),
                  'questions',
                )
                return questions
              },
            }),
          },
        },
        always: [{target: 'idle', cond: 'questionsArePresent'}],
      },
      idle: {
        on: {
          SUBMIT: {
            target: 'answering',
            actions: assign({
              answers: (context, event) => {
                const {answers} = context
                return [...answers, event.answer]
              },
            }),
          },
        },
      },
      answering: {
        invoke: {
          id: 'postingAnswer',
          src: (context, event) => {
            const {answers, currentQuestionId} = context
            const answer = find(answers, {id: currentQuestionId})
            console.log({answer})

            // return axios.post()
            return new Promise((resolve, reject) => {
              if (true) {
                setTimeout(() => resolve(), 1000)
              } else {
                reject()
              }
            })
          },

          onDone: {target: 'answered'},
          onError: {target: 'failure'},
        },
      },
      answered: {
        on: {
          NEXT_QUESTION: {
            target: 'idle',
            actions: assign({
              currentQuestionId: (_context, event) => {
                return event.nextQuestionId
              },
            }),
          },
        },
      },
      failure: {
        always: [{target: 'idle'}],
      },
    },
  },
  {
    guards: {
      questionsArePresent: (context, _event) => {
        return !isEmpty(context.questions)
      },
    },
    services: {
      fetchQuizData: (ctx) => fetchQuizData(ctx.slug),
    },
  },
)
