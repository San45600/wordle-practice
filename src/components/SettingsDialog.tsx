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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGameState } from "./state/States";
import { Input } from "./ui/input";
import { useState } from "react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { DragndropZone } from "./DragndropZone";
import { MdOutlineDeleteForever } from "react-icons/md";
import { FaEllipsis, FaCircleQuestion } from "react-icons/fa6";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";
import { Switch } from "./ui/switch";

export function SettingsDialog() {
  const {
    openSettingsDialog,
    maximumRound,
    wordList,
    hardMode,
    setHardMode,
    setWordList,
    setOpenSettingsDialog,
    setMaximumRound,
  } = useGameState();

  const [tempMaximumRound, setTempMaximumRound] = useState(maximumRound);
  const [tempWordList, setTempWordList] = useState<string[]>(wordList);
  const [newWord, setNewWord] = useState("");
  const [tempHardMode, setTempHardMode] = useState(hardMode);

  const validateSettings = () => {
    if (tempWordList.length === 0) {
      toast.error("Word list must contain at least one word");
      return false;
    }
    if (tempMaximumRound <= 0) {
      toast.error("Maximum round must be greater than 0");
      return false;
    }
    return true;
  };

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
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>Hard Mode</span>

              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger>
                    <FaCircleQuestion />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Hard Mode: Restricts guesses to words from the custom word
                      list only.
                    </p>
                    <ul className="list-disc pl-5 mt-2">
                      <li>
                        All guesses must be valid words from word
                        list
                      </li>
                      <li>
                        Prevents guessing words not in the game&apos;s vocabulary
                      </li>
                      <li>
                        Increases difficulty by limiting available options
                      </li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Switch
              id="hard-mode"
              checked={tempHardMode}
              onCheckedChange={setTempHardMode}
            />
          </div>
          <Separator className="my-4" />
          <div className="flex flex-col gap-4">
            Words list:
            <Command className="relative">
              <CommandInput placeholder="Search words..." />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="absolute top-[15px] right-[11px]">
                    <FaEllipsis />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <Input
                    placeholder="input new word here..."
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key == " ") e.preventDefault();
                      if (newWord.length === 5 && e.key != "Backspace")
                        e.preventDefault();
                    }}
                  ></Input>
                  <DropdownMenuItem
                    onClick={(e) => {
                      if (newWord.trim().length !== 5) {
                        toast.error("Word must be exactly 5 letters long");
                        e.preventDefault();
                      } else if (!/^[a-z]{5}$/i.test(newWord.trim())) {
                        toast.error("Word must only contain letters a-z");
                        e.preventDefault();
                      } else if (tempWordList.includes(newWord.trim())) {
                        toast.error("Word already exists in the list");
                        e.preventDefault();
                      } else {
                        setTempWordList([
                          ...tempWordList,
                          newWord.trim().toLowerCase(),
                        ]);
                        setNewWord(""); // Clear the input after adding
                      }
                    }}
                  >
                    Add new word
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      setTempWordList([
                        "apple",
                        "brain",
                        "flame",
                        "crown",
                        "light",
                      ]);
                    }}
                  >
                    Reset wordList to default
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <CommandList>
                <CommandEmpty>No words found.</CommandEmpty>
                <CommandGroup>
                  {tempWordList.map((val, index) => (
                    <CommandItem key={index} className="flex justify-between">
                      <span>{val}</span>
                      <button
                        onClick={() => {
                          const newList = tempWordList.filter(
                            (_, i) => i !== index
                          );
                          setTempWordList(newList);
                        }}
                      >
                        <MdOutlineDeleteForever color="red" />
                      </button>
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
                setTempWordList(wordList);
                setTempHardMode(hardMode);
              }}
            >
              Cancel
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button
              onClick={(e) => {
                if (validateSettings()) {
                  setMaximumRound(tempMaximumRound);
                  setWordList(tempWordList);
                  setHardMode(tempHardMode);
                } else {
                  e.preventDefault();
                }
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
