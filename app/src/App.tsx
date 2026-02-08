import { useState, useEffect } from 'react'
import { HomePage } from './components/HomePage'
import { QuizPage } from './components/QuizPage'
import { ResultsPage } from './components/ResultsPage'
import { fetchQuestions } from './lib/api'
import type { Question } from './types/question'

type Page = 'home' | 'quiz' | 'results'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [answers, setAnswers] = useState<number[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [additionalInfo, setAdditionalInfo] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (currentPage === 'quiz' && questions.length === 0) {
      setLoading(true)
      fetchQuestions()
        .then((data) => {
          setQuestions(data)
          setLoading(false)
        })
        .catch((err) => {
          setError(err.message || 'Failed to load questions')
          setLoading(false)
        })
    }
  }, [currentPage, questions.length])

  const handleStartQuiz = () => {
    setCurrentPage('quiz')
    setAnswers([])
    setAdditionalInfo('')
    setError(null)
  }

  const handleQuizComplete = (quizAnswers: number[], info?: string) => {
    setAnswers(quizAnswers)
    setAdditionalInfo(info || '')
    setCurrentPage('results')
  }

  const handleRestart = () => {
    setCurrentPage('home')
    setAnswers([])
    setAdditionalInfo('')
    setQuestions([])
  }

  return (
    <>
      {currentPage === 'home' && <HomePage onStartQuiz={handleStartQuiz} />}
      {currentPage === 'quiz' && (
        <>
          {loading && (
            <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl mb-4">Loading questions...</div>
              </div>
            </div>
          )}
          {error && (
            <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl mb-4 text-red-500">Error: {error}</div>
                <button
                  onClick={() => {
                    setError(null)
                    setCurrentPage('home')
                  }}
                  className="px-4 py-2 bg-purple-500 rounded-lg"
                >
                  Go Back
                </button>
              </div>
            </div>
          )}
          {!loading && !error && questions.length > 0 && (
            <QuizPage 
              questions={questions} 
              onComplete={handleQuizComplete}
              onBack={() => setCurrentPage('home')}
            />
          )}
        </>
      )}
      {currentPage === 'results' && (
        <ResultsPage
          answers={answers}
          questions={questions}
          additionalInfo={additionalInfo}
          onRestart={handleRestart}
          onBack={() => setCurrentPage('home')}
        />
      )}
    </>
  )
}

export default App
