import { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'
/*
export function AuthCallback() {
  const navigate = useNavigate()
  const initAuth = firebaseStore(selectInitAuth)
  const user = firebaseStore(selectUser)

  useEffect(() => {
    const handleSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (!error && data.session) {
        console.log('✅ Session restored after OAuth:', data.session)
        navigate('/dashboard')
      } else {
        console.error('❌ No session found after callback', error)
      }
    }
    handleSession()
  }, [navigate])

  return <p>Completing sign-in...</p>
}
*/