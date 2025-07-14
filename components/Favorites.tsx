import { cn } from "@/lib/utils";
import { Bookmark } from "lucide-react"; // or use an Image if you prefer
import Link from "next/link";

interface FavoriteYooly {
  id: string;
  name: string;
  sessionCount?: number; // for now hardcoded
}

interface FavoriteYoolysListProps {
  yoolys: FavoriteYooly[];
  classNames?: string;
}

const FavoriteYoolysList = ({ yoolys, classNames }: FavoriteYoolysListProps) => {
  return (
    <section className={cn('companion-list', classNames)}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-xl text-[#2D2C4D]">FAVORITES</h2>
        <div className="bg-[#2D2C4D] rounded-4xl p-1">
            <Bookmark className="text-[#FFF] fill-[#FFF]" size={24}/>
        </div>
      </div>
      <ul className="space-y-4">
        {yoolys.map(({id,name,sessionCount}, index) => (
          <li
            key={id}
            className="flex justify-between items-center border-t first:border-t-0 pt-2"
          >
            <Link href={`/companions/${id}`} className="text-md font-medium text-[#2D2C4D]">
              {name}
            </Link>
            <span className="bg-[#F3F4F8] text-[#2D2C4D] font-semibold text-sm px-3 py-1 rounded-xl">
              {sessionCount ?? [125, 15, 24, 10][index] /* fallback mock data */}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default FavoriteYoolysList;
