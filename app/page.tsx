import CompanionCard from "@/components/CompanionCard";
import CompanionsList from "@/components/CompanionsList";
import CTA from "@/components/CTA";
import { getAllCompanions, getRecentSessions } from "@/lib/actions/companion.actions";
import { getSubjectColor } from "@/lib/utils";

const Page = async () => {
  const companions = await getAllCompanions({limit: 4})
  const  recentSessionCompanions = await getRecentSessions(10)
  return (
    <main className="gap-2">
      {/* <h1 className="text-2xl">Popular Companions</h1> */}
      <section className="home-hero-section">
        {companions.map((companion)=>(
          <CompanionCard
            key={companion.id}
            {...companion}
            color={getSubjectColor(companion.subject)}
          />
        ))}
      
      </section>
      <section className="home-section">
        <CompanionsList
          title="Recently Completed Sessions"
          companions={recentSessionCompanions}
          classNames="w-3/4  max-lg:w-full"
        />
        <CTA />
      </section>
    </main>
  );
};

export default Page;
