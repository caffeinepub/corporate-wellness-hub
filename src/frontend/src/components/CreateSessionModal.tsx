import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProgramType } from "../hooks/useQueries";
import { useCreateSession } from "../hooks/useQueries";
import { PROGRAM_CONFIGS, PROGRAM_ORDER } from "../lib/programConfig";

interface CreateSessionModalProps {
  defaultType?: ProgramType;
  onCreated?: (id: bigint) => void;
}

export function CreateSessionModal({
  defaultType,
  onCreated,
}: CreateSessionModalProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("20");
  const [programType, setProgramType] = useState<ProgramType>(
    defaultType ?? ProgramType.meetup,
  );

  const createMutation = useCreateSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !dateTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    const dateMs = new Date(dateTime).getTime();
    if (Number.isNaN(dateMs)) {
      toast.error("Invalid date/time");
      return;
    }

    try {
      const sessionId = await createMutation.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        programType,
        dateTime: BigInt(dateMs * 1_000_000),
        maxParticipants: BigInt(Number.parseInt(maxParticipants) || 20),
      });
      toast.success("Session created!");
      setOpen(false);
      resetForm();
      onCreated?.(sessionId);
    } catch {
      toast.error("Failed to create session. Please try again.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDateTime("");
    setMaxParticipants("20");
    setProgramType(defaultType ?? ProgramType.meetup);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-ocid="session.create_button">
          <Plus className="w-4 h-4 mr-2" />
          Create Session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg" data-ocid="create_session.dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Create a New Session
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="cs-title">Title</Label>
            <Input
              id="cs-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sunday Morning Yoga"
              required
              data-ocid="create_session.title_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cs-description">Description</Label>
            <Textarea
              id="cs-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will you do together? What should participants expect?"
              rows={3}
              required
              data-ocid="create_session.description_textarea"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cs-datetime">Date & Time</Label>
              <Input
                id="cs-datetime"
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                required
                data-ocid="create_session.datetime_input"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cs-max">Max Participants</Label>
              <Input
                id="cs-max"
                type="number"
                min="2"
                max="200"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value)}
                data-ocid="create_session.max_input"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Program Type</Label>
            <Select
              value={programType}
              onValueChange={(v) => setProgramType(v as ProgramType)}
            >
              <SelectTrigger data-ocid="create_session.type_select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROGRAM_ORDER.map((type) => {
                  const cfg = PROGRAM_CONFIGS[type];
                  return (
                    <SelectItem key={type} value={type}>
                      <span className="flex items-center gap-2">
                        {cfg.emoji} {cfg.label}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
              data-ocid="create_session.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              data-ocid="create_session.submit_button"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating…
                </>
              ) : (
                "Create Session"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
