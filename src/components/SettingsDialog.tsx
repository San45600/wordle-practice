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
import { useGameState } from "./state/useGameState";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
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
import { CgSpinner } from "react-icons/cg";

export function SettingsDialog() {
  const {
    openSettingsDialog,
    originalMaximumRound,
    originalWordList,
    originalHardMode,
    setOriginalHardMode,
    setOriginalWordList,
    setOpenSettingsDialog,
    setOriginalMaximumRound,
  } = useGameState();

  const [tempMaximumRound, setTempMaximumRound] = useState(6);
  const [tempWordList, setTempWordList] = useState<string[]>([]);
  const [newWord, setNewWord] = useState("");
  const [tempHardMode, setTempHardMode] = useState(false);

  const [settingsFetching, setWordlistFetching] = useState(false);
  const [settingsFetchError, setWordlistFetchError] = useState(false);

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

  const fetchWordList = async () => {
    try {
      setWordlistFetching(true);
      const response = await fetch("/api/settings/get");
      const data = await response.json();
      setTempWordList(data.wordlist);
      setTempHardMode(data.hardMode);
      setTempMaximumRound(data.maximumRound)
      setOriginalWordList(data.wordlist);
      setOriginalHardMode(data.hardMode);
      setOriginalMaximumRound(data.maximumRound)
      setWordlistFetching(false);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error(
        "Error fetching the word list, check console for more detail."
      );
      setWordlistFetching(false);
      setWordlistFetchError(true);
    }
  };

  useEffect(() => {
    fetchWordList();
  }, []);

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
                      <li>All guesses must be valid words from word list</li>
                      <li>
                        Prevents guessing words not in the game&apos;s
                        vocabulary
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

              {settingsFetchError ? (
                <div className="w-full flex flex-col gap-4 items-center justify-center mt-4">
                  Error fetching wordlist
                  <Button onClick={() => fetchWordList()}>Refetch</Button>
                </div>
              ) : settingsFetching ? (
                <div className="w-full flex gap-2 justify-center mt-4">
                  <CgSpinner className="animate-spin" size={24} /> Loading...
                </div>
              ) : (
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
              )}
            </Command>
            {!settingsFetching && !settingsFetchError && (
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
            )}
          </div>
        </div>
        <SheetFooter className="">
          <SheetClose asChild>
            <Button
              variant={"ghost"}
              disabled={settingsFetching}
              onClick={() => {
                if (settingsFetchError || settingsFetching) return;

                setTempMaximumRound(originalMaximumRound);
                setTempHardMode(originalHardMode);
                setTempWordList(originalWordList);
              }}
            >
              Cancel
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button
              disabled={settingsFetchError || settingsFetching}
              onClick={async (e) => {
                if (validateSettings()) {
                  try {
                    const response = await fetch("/api/settings/update", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        newWordList: tempWordList,
                        mode: tempHardMode,
                        newMaximumRound: tempMaximumRound
                      }),
                    });

                    if (!response.ok) {
                      throw new Error("Failed to update settings");
                    }

                    toast.success("Settings updated successfully");
                    setOpenSettingsDialog(false);
                    fetchWordList();
                  } catch (error) {
                    console.error("Error updating settings:", error);
                    toast.error("Failed to update settings. Please try again.");
                    e.preventDefault(); // Prevent dialog from closing on error
                  }
                } else {
                  e.preventDefault();
                }
              }}
            >
              {settingsFetching ? (
                <CgSpinner className="animate-spin" />
              ) : (
                "Save changes"
              )}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
