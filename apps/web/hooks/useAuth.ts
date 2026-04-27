import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase'
import { User } from '@supabase/supabase-js'
import { Profile } from '../lib/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
          
        setProfile(profileData)
        setIsAdmin(profileData?.role === 'admin')
      }
      setLoading(false)
    }

    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      
      if (currentUser) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single()
          
        setProfile(profileData)
        setIsAdmin(profileData?.role === 'admin')
      } else {
        setProfile(null)
        setIsAdmin(false)
      }
      setLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => supabase.auth.signInWithPassword({ email, password })
  const signUp = async (email: string, password: string, fullName: string) => supabase.auth.signUp({ 
    email, 
    password, 
    options: {
      data: { full_name: fullName }
    }
  })
  const signOut = async () => supabase.auth.signOut()

  return { user, profile, loading, signIn, signUp, signOut, isAdmin }
}
