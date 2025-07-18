import CompanionCard from "@/components/CompanionCard"
import SearchInput from "@/components/SearchInput"
import SubjectFilter from "@/components/SubjectFilter"
import { getAllCompanions } from "@/lib/actions/companion.actions"
import { getSubjectColor } from "@/lib/utils"
import Link from "next/link"

const CompanionsLibrary = async ({searchParams}: SearchParams) => {

  const filters = await searchParams
  const subject = filters.subject ? filters.subject : ''
  const topic = filters.topic ? filters.topic : ''

  const companions = await getAllCompanions({ subject, topic })

  return (
    <main>
      <section className="flex justify-end gap-2 max-sm:flex-col ">
      {/* <h1 className="text-[#272a4c] opacity-15">YOOLY LIBRARY</h1> */}
      <div className="flex gap-2">
        <SearchInput/>
        <SubjectFilter />

      </div>
      </section>
      <section className="companions-grid">
        <>
        {
          companions.map((companion)=>(
            <CompanionCard key={companion.id} 
            {...companion}
            color={getSubjectColor(companion.subject)}
            />
          ))
        }
      <article className="companion-card" style={{ backgroundColor: "#272A4C" }}>
        <div className="h-full flex justify-center items-center">
          <h2 className="text-3xl font-bold text-white" >
            Ready to Get Smarter?
          </h2>
        </div>
        <Link href={`/companions/new`} className="w-full">
          <button className="btn-primary  bg-background  text-[#272A4C] font-bold w-full justify-center">
            Build new Yooly
          </button>
        </Link>
      </article>
      </>
      </section>
    </main>
  )
}

export default CompanionsLibrary