import CompanionForm from "@/components/CompanionForm"
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const NewCompanion = async () => {
  const { userId } = await auth();

  if(!userId) redirect('/sign-in');
  
  return (
    <main className="min-lg:w1/3 min-md:2/3 min-sm:w-ful items-center justify-center">
      <article className="flex flex-col w-full gap-4">
        <h1>Companion Builder</h1>
        <CompanionForm />
      </article>
    </main>
  )
}

export default NewCompanion