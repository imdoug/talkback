'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"

export default function Welcome() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded || !user) return;

    const createProfile = async () => {
      await fetch("/api/create-profile", {
        method: "POST",
      })

      router.push("/") 
    }

    createProfile()
  }, [user, isLoaded])

  return (
    <p>Setting things up for you...</p>
  );
}
