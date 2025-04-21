import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface LetterTileProps {
  letter: string;
  status: "correct" | "present" | "absent" | "empty";
}

function LetterTile({ letter, status }: LetterTileProps) {
  return (
    <div
      className={cn(
        "flex h-12 w-12 items-center justify-center border-2 text-2xl font-bold",
        status === "correct" && "bg-green-700 text-white border-green-700",
        status === "present" && "bg-yellow-700 text-white border-yellow-700",
        status === "absent" && "bg-gray-700 text-white border-gray-700",
        status === "empty" && "bg-gray-500 text-white border-gray-500"
      )}
    >
      {letter}
    </div>
  );
}

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowToPlayModal({ isOpen, onClose }: HowToPlayModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">How To Play</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <p className="text-lg">Guess the Wordle in 6 tries.</p>

          <ul className="ml-6 list-disc space-y-2">
            <li>Each guess must be a valid 5-letter word.</li>
            <li>
              The color of the tiles will change to show how close your guess
              was to the word.
            </li>
          </ul>

          <div className="space-y-4">
            <h3 className="font-medium">Examples</h3>

            <div className="space-y-2">
              <div className="flex gap-1">
                <LetterTile letter="W" status="correct" />
                <LetterTile letter="O" status="empty" />
                <LetterTile letter="R" status="empty" />
                <LetterTile letter="D" status="empty" />
                <LetterTile letter="Y" status="empty" />
              </div>
              <p>
                <span className="font-bold">W</span> is in the word and in the
                correct spot.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex gap-1">
                <LetterTile letter="L" status="empty" />
                <LetterTile letter="I" status="present" />
                <LetterTile letter="G" status="empty" />
                <LetterTile letter="H" status="empty" />
                <LetterTile letter="T" status="empty" />
              </div>
              <p>
                <span className="font-bold">I</span> is in the word but in the
                wrong spot.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex gap-1">
                <LetterTile letter="R" status="empty" />
                <LetterTile letter="O" status="empty" />
                <LetterTile letter="G" status="empty" />
                <LetterTile letter="U" status="absent" />
                <LetterTile letter="E" status="empty" />
              </div>
              <p>
                <span className="font-bold">U</span> is not in the word in any
                spot.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
