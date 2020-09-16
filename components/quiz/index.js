import React from 'react'

import MultipleChoice from './templates/multipleChoice'
import Essay from './templates/essay'
import Theater from './templates/theater'
import Sketch from './templates/sketch'

import useEggheadQuiz from '../../hooks/useEggheadQuiz'

const QuizTemplate = ({quiz}) => {
  const {questions, onSubmit} = useEggheadQuiz(quiz)

  return (
    <div>
      {questions.map((question) => {
        let QuestionToShow
        switch (question.type) {
          case 'multiple-choice':
            QuestionToShow = MultipleChoice
            break
          case 'essay':
            QuestionToShow = Essay
            break
          case 'theater':
            QuestionToShow = Theater
            break
          //   case 'sketch':
          //     QuestionToShow = Sketch
          //     break
          // case 'trueFalse':
          //   QuestionToShow = TrueFalse
          //   break
          default:
            return null
        }

        return (
          <QuestionToShow
            question={question}
            onSubmit={onSubmit}
            key={question.id}
          />
        )
      })}
    </div>
  )
}

export default QuizTemplate