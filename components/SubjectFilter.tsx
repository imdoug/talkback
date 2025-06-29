'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { subjects } from "@/constants"
import { formUrlQuery, removeKeysFromUrlQuery } from "@jsmastery/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const SubjectFilter = () => {
      const router = useRouter()
      const searchParams = useSearchParams()
      // const query = searchParams.get('topic') || ''
  
      const [subject, setSubject] = useState('')
  
      useEffect(() => {
          let newUrl = "";
          if(subject === "all"){
              newUrl = removeKeysFromUrlQuery({
              params: searchParams.toString(),
              keysToRemove: ["subject"]
            })
          }else{
              newUrl = formUrlQuery({
              params: searchParams.toString(),
              key: "subject",
              value: subject
            })
          }
          router.push(newUrl, {scroll: false})
      }, [router, searchParams, subject])
  return (
    <Select onValueChange={(value) => setSubject(value.toLocaleLowerCase())}>
      <SelectTrigger className="input capitalize border-0 rounded-3xl px-4 py-5 h-fit">
        <SelectValue placeholder="Select subject" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All subjects</SelectItem>
        {
          subjects.map((subject) => (
            <SelectItem 
              key={subject} 
              value={subject}>
                  {subject}
            </SelectItem>
          ))
        }
      </SelectContent>
  </Select>
  )
}

export default SubjectFilter