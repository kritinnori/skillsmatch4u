import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { HomePage } from './components/HomePage'
import { QuizPage } from './components/QuizPage'
import { ResultsPage } from './components/ResultsPage'
import { fetchQuestions } from './lib/api'
import type { Question } from './types/question'

type Page = 'home' | 'quiz' | 'results'

function App() {
  const { t, i18n } = useTranslation()
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [answers, setAnswers] = useState<number[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [additionalInfo, setAdditionalInfo] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const language = i18n.resolvedLanguage || i18n.language || 'en'

  useEffect(() => {
    let cancelled = false

    const loadQuestions = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchQuestions(language)

        if (!cancelled) {
          setQuestions(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : t('quiz.failedToLoad')
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadQuestions()

    return () => {
      cancelled = true
    }
  }, [language, t])

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
    setError(null)
  }

  return (
    <>
      {currentPage === 'home' && (
        <HomePage onStartQuiz={handleStartQuiz} />
      )}

      {currentPage === 'quiz' && (
        <>
          {loading && (
            <div className="page-shell flex items-center justify-center">
              <div className="text-center bg-white rounded-xl border border-gray-200 px-10 py-8 shadow-sm">
                <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900">
                  {t('quiz.loading')}
                </p>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="page-shell flex items-center justify-center px-4">
              <div className="text-center bg-white rounded-xl border border-gray-200 p-10 shadow-sm max-w-md">
                <p className="text-lg mb-4 text-red-600 font-medium">
                  {t('common.errorPrefix')}: {error}
                </p>
                <button
                  onClick={() => {
                    setError(null)
                    setCurrentPage('home')
                  }}
                  className="px-6 py-2.5 bg-primary-800 hover:bg-primary-900 text-white font-semibold rounded-lg transition-colors"
                >
                  {t('common.goBackButton')}
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
