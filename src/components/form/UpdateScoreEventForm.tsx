import { GlobalContext } from "@/App";
import { useContext, type Dispatch, type SetStateAction } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "../ui/field";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import z from "zod";
import {
  PlayerId,
  ScoreTypeSchema,
  type Event,
} from "@/routes/data-server/types";
import { updateEvent } from "@/services/event";
import { toast } from "sonner";

const formId = "update-score-event-form";

const formSchema = z.object({
  // player: PlayerId,
  // assist: PlayerId.optional(),
  score_type: ScoreTypeSchema,
});

type FormSchema = z.infer<typeof formSchema>;

type Props = {
  event: Event;
  setEvents: Dispatch<SetStateAction<Event[]>>;
  closeModal: () => void;
};

const UpdateScoreEventForm = (props: Props) => {
  const { event, setEvents, closeModal } = props;
  const { state, webSocketControls } = useContext(GlobalContext);

  const form = useForm<FormSchema>({
    defaultValues: {
      score_type: event.score_type ?? undefined,
    },
  });

  function handleCloseModal() {
    form.reset();
    closeModal();
  }

  function handleUpdateEvent(data: FormSchema) {
    const updated = { ...event, ...data };

    updateEvent(updated);
    setEvents((prev) => {
      const eventIndex = prev.findIndex((e) => e.id === updated.id);
      return prev.toSpliced(eventIndex, 1, updated);
    });
    handleCloseModal();
  }

  return (
    <DialogContent showCloseButton={false}>
      <DialogHeader>
        <DialogTitle>Update Score Event</DialogTitle>
        <DialogDescription>Update the details of an event.</DialogDescription>
      </DialogHeader>
      <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
        <form id={formId} onSubmit={form.handleSubmit(handleUpdateEvent)}>
          <FieldGroup>
            <Controller
              name="score_type"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldSet data-invalid={fieldState.invalid}>
                  <FieldLegend>Score Type</FieldLegend>
                  <FieldDescription>
                    You can upgrade or downgrade your plan at any time.
                  </FieldDescription>
                  <RadioGroup
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                    className="grid-cols-3"
                  >
                    {Object.values(ScoreTypeSchema.def.entries).map(
                      (scoreType) => (
                        <FieldLabel
                          key={scoreType}
                          htmlFor={`event-type--${scoreType}`}
                          className="cursor-pointer"
                        >
                          <Field orientation="horizontal">
                            <FieldContent>
                              <FieldDescription>{scoreType}</FieldDescription>
                            </FieldContent>
                            <RadioGroupItem
                              value={scoreType}
                              id={`event-type--${scoreType}`}
                              onChange={(e) => console.log(e)}
                              // className="invisible"
                            />
                          </Field>
                        </FieldLabel>
                      ),
                    )}
                  </RadioGroup>
                </FieldSet>
              )}
            />
          </FieldGroup>
        </form>
      </div>
      <DialogFooter className="sm:justify-start">
        <Button type="button" variant="secondary" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button type="submit" form={formId}>
          Select
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default UpdateScoreEventForm;
