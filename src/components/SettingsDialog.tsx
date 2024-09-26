"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useGameState } from "./state/States";
import { Input } from "./ui/input";
import { useState } from "react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { DragndropZone } from "./DragndropZone";

export function SettingsDialog() {
  const {
    openSettingsDialog,
    maximumRound,
    wordList,
    setWordList,
    setOpenSettingsDialog,
    setMaximumRound,
  } = useGameState();

  const [tempMaximumRound, setTempMaximumRound] = useState(maximumRound);
  const [tempWordList, setTempWordList] = useState<string[]>(wordList);

  return (
    <Sheet open={openSettingsDialog} onOpenChange={setOpenSettingsDialog}>
      <SheetContent
        side={"left"}
        className="flex flex-col justify-between min-w-[32rem]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="flex flex-col gap-4">
          <SheetTitle></SheetTitle>
          <div className="flex gap-4 items-center">
            Maximum round:
            <Input
              className="w-36"
              value={tempMaximumRound}
              onChange={(e) => setTempMaximumRound(Number(e.target.value))}
              type="number"
              placeholder="rounds..."
            />
          </div>
          <Separator className="my-4" />
          <div className="flex flex-col gap-4">
            Words list:
            <Command>
              <CommandInput placeholder="Search words..." />
              <CommandList>
                <CommandEmpty>No words found.</CommandEmpty>
                <CommandGroup>
                  {tempWordList.map((val, index) => (
                    <CommandItem key={index} className="flex justify-between">
                      <span>{val}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
            <div className="flex flex-col gap-2">
              <DragndropZone
                onFileChange={(file) => {
                  var reader = new FileReader();

                  reader.onload = (e) => {
                    if (!e.target) return;
                    const data = JSON.parse(e.target.result as string);
                    setTempWordList(data);
                  };
                  reader.readAsText(file);
                }}
              >
                Drag and drop, or click here to import JSON word list.
              </DragndropZone>
              {/* <Button>Export words list to JSON</Button> */}
            </div>
          </div>
        </div>
        <SheetFooter className="">
          <SheetClose asChild>
            <Button
              variant={"ghost"}
              onClick={() => {
                setTempMaximumRound(maximumRound);
              }}
            >
              Cancel
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button
              onClick={() => {
                setMaximumRound(tempMaximumRound);
                setWordList(tempWordList);
              }}
            >
              Save changes
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
