import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, getSubjectColor } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
interface CompanionsListsProps {
  title: string;
  companions?: Companion[]; // Adjust the type as per your data structure
  classNames?: string;
}
const CompanionsList = ({title, companions, classNames}: CompanionsListsProps) => {
  return (
    <article className={cn('companion-list', classNames)}>
      <h2 className="font-bold text-3xl">{title}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-lg w-2/3 text-[#D1D4DC] uppercase">Lessons</TableHead>
            <TableHead className="text-lg text-[#D1D4DC] uppercase">Subject</TableHead>
            <TableHead className="text-lg text-righ text-[#D1D4DC] uppercase">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {companions?.map(({id,subject,name, topic, duration}, index) => (
                <TableRow key={index}>
                    <TableCell className="font-medium">
                        <Link href={`/companions/${id}`}>
                        <div className="flex items-center gap-2">
                            <div className="size-[72px] rounded-3xl justify-center flex items-center max-md:hidden"
                                style={{backgroundColor: getSubjectColor(subject)}}>
                                <Image 
                                    src={`/icons/${subject}.svg`} 
                                    alt={subject} 
                                    width={35} 
                                    height={35} 
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="font-bold text-2xl">{name}</p>
                                <p className="text-lg">{topic}</p>
                            </div>
                        </div>
                        </Link>
                    </TableCell>
                    <TableCell>
                        <div className="subject-badge w-fit max-md:hidden">
                
                            <span className="text-lg">{subject}</span>
                        </div>
                        <div className="flex items-center justify-center rounded-lg 2-fit p-2 md:hidden" style={{backgroundColor: getSubjectColor(subject)}}>
                            <Image
                                src={`/icons/${subject}.svg`} 
                                alt={subject} 
                                width={18} 
                                height={18}
                            />
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center justify-end gap-2 w-full">
                            <p className="text-2xl">{duration}  {' '}
                                <span className="max-md:hidden">mins</span>
                            </p>
                            <Image
                                    src="/icons/clock.svg"
                                    alt="Duration Icon"
                                    width={14}
                                    height={14}
                                    className="max-md:hidden"
                            />
                        </div>
                    </TableCell>
                </TableRow>
            ))} 
        </TableBody>
      </Table>
    </article>
  );
};

export default CompanionsList;
