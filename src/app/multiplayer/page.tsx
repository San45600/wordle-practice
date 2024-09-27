import { MultiWordleGame } from "@/components/multiplayer/MultiWordleGame";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="px-16 py-12">
      <Card className=" bg-[#18181b] h-full">
        <MultiWordleGame />
      </Card>
    </div>
  );
}
