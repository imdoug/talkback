import CompanionsList from "@/components/CompanionsList";
import FavoriteYoolysList from "@/components/Favorites";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
import {
  getUserCompanions,
  getUserSessions,
  getBookmarkedCompanions,
} from "@/lib/actions/companion.actions";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

const Profile = async () => {
  const user = await currentUser();
  if (!user) redirect("/");

  const companions = await getUserCompanions(user.id);
  const sessionHistory = await getUserSessions(user.id);
  const bookmarkedCompanions = await getBookmarkedCompanions(user.id);

  return (
    <main className="min-lg:w-4/4 w-full gap-2">
      <section className="flex gap-2 max-sm:flex-col items-stretch w-full h-[330px] max-sm:h-[100%] max-sm:p-2">
        {/* Left Side */}
      <div className="flex items-center gap-2 flex-1 max-w-[50%] max-sm:max-w-[100%] max-sm:w-full bg-white p-6 rounded-3xl h-full">

      {/* Image */}
      <div className="h-full aspect-[3/4] rounded-[1.5rem] overflow-hidden">
        <Image
          src={user.imageUrl}
          alt={user.firstName!}
          width={200}
          height={300}
          className="h-full w-full object-cover rounded-[1rem]"
        />
      </div>


      {/* Info */}
      <div className="flex flex-col justify-around h-full">
        <div className="flex flex-col">
          <h2 className="text-xl text-muted-foreground font-semibold max-sm:text-lg">
            BASIC BEAT
          </h2>
          <h1 className="text-xl font-bold text-gray-900 max-sm:text-xl">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-sm text-muted-foreground max-sm:text-base">
            {user.emailAddresses[0].emailAddress}
          </p>
        </div>
        <button className="mt-4 bg-[#2D2C4D] hover:bg-[#1f1e35] text-white rounded-full py-2 px-6 font-semibold transition">
          UPGRADE NOW
        </button>
      </div>
      </div>




  {/* Right Side */}
  <div className="flex gap-2 items-stretch flex-1 max-w-[50%] max-sm:max-w-[100%] max-sm:w-full h-full">
    <div className="flex flex-col justify-around h-full border p-5 bg-background rounded-3xl flex-1">
      <p className="text-8xl font-bold">{sessionHistory.length}</p>
      <div className="text-2xl font-bold text-[#D1D4DC]">
        Lessons  completed
      </div>
      <p className="text-sm">
        Your brain must be getting buff with all these lesson hours. Flex those
        skills and keep at it!
      </p>
    </div>

    <div className="flex flex-col justify-around h-full border p-5 bg-background rounded-3xl flex-1">
      <p className="text-8xl font-bold">{companions.length}</p>
      <div className="text-2xl font-bold text-[#D1D4DC]">
        Yoolys created
      </div>
      <p className="text-sm">
        The more companions you create, the more ways you unlock to learn and
        grow. Keep going!
      </p>
    </div>
  </div>

      </section>
      <section className="flex gap-2 max-sm:flex-col w-full h-full max-sm:p-2 max-sm:align-center">
        <CompanionsList
          title="Completed Lessons"
          companions={companions}
          classNames="flex-1 max-w-[75%] max-sm:max-w-100 max-sm:w-full"
        />
        <FavoriteYoolysList
          yoolys={bookmarkedCompanions.flat()}
          classNames="flex-1 max-w-[25%] max-sm:max-w-100  max-sm:w-full"
        />
      </section>
      {/* <Accordion type="multiple">
        <AccordionItem value="bookmarks">
          <AccordionTrigger className="text-2xl font-bold">
            Bookmarked Companions {`(${bookmarkedCompanions.length})`}
          </AccordionTrigger>
          <AccordionContent>
            <CompanionsList
              companions={bookmarkedCompanions}
              title="Bookmarked Companions"
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="recent">
          <AccordionTrigger className="text-2xl font-bold">
            Recent Sessions
          </AccordionTrigger>
          <AccordionContent>
            <CompanionsList
              title="Recent Sessions"
              companions={sessionHistory}
            />
          </AccordionContent>
        </AccordionItem>
        <CompanionsList
          title="Completed Lessons"
          companions={companions}
          classNames={"w-4/5"}
        />
      </Accordion> */}
    </main>
  );
};

export default Profile;
