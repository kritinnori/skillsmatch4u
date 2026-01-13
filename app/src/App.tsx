import { useState } from 'react'
import { HomePage } from './components/HomePage'
import { QuizPage } from './components/QuizPage'
import { ResultsPage } from './components/ResultsPage'
import { questions } from './data/questions'

type Page = 'home' | 'quiz' | 'results'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [answers, setAnswers] = useState<number[]>([])

  const handleStartQuiz = () => {
    setCurrentPage('quiz')
    setAnswers([])
  }

  const handleQuizComplete = (quizAnswers: number[]) => {
    setAnswers(quizAnswers)
    setCurrentPage('results')
  }

  const handleRestart = () => {
    setCurrentPage('home')
    setAnswers([])
  }

  return (
    <>
      {currentPage === 'home' && <HomePage onStartQuiz={handleStartQuiz} />}
      {currentPage === 'quiz' && (
        <QuizPage 
          questions={questions} 
          onComplete={handleQuizComplete}
          onBack={() => setCurrentPage('home')}
        />
      )}
      {currentPage === 'results' && (
        <ResultsPage
          answers={answers}
          onRestart={handleRestart}
          onBack={() => setCurrentPage('home')}
        />
      )}
    </>
  )
}

export default App
