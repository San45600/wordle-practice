import { Card } from "@/components/ui/card";
import { WordleGame } from "@/components/WordleGame";

export default function Home() {
  return (
    <div className="px-16 py-12">
      <Card className=" bg-[#18181b] h-full">
        <WordleGame />
      </Card>
    </div>
  );
}
