import { Settings } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/App";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import type { Match } from "@/routes/data-server/types";
import { fetchAllMatches } from "@/services/match";
import { useForm, Controller } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "../ui/field";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const MatchSettings = () => {
  const { state, webSocketControls } = useContext(GlobalContext);

  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [matchList, setMatchList] = useState<Match[]>([]);

  const form = useForm({
    defaultValues: { match: matchList[0]?.id },
  });

  useEffect(() => {
    if (matchList.length) return;
    fetchAllMatches().then((m) => setMatchList(m));
  }, [isMatchModalOpen]);

  function handleMatchModalClose() {
    setIsMatchModalOpen(false);
  }

  function handleMatchSelect(e: any) {
    setIsMatchModalOpen(false);
    webSocketControls?.setMatch(e.match);
  }

  function handleResetTime() {
    webSocketControls?.resetTime();
  }

  function handleResetScore() {
    webSocketControls?.resetScore();
  }

  function handleChangePeriod(period: string) {
    webSocketControls?.setPeriod({ period: Number(period) });
    handleResetTime();
  }

  function handleChangePeriodCount(count: string) {
    webSocketControls?.setPeriod({ total: Number(count) });
  }

  function handleChangePeriodLimit(limit: string) {
    webSocketControls?.setPeriodLimit(Number(limit));
    webSocketControls?.resetTime();
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Match Settings</CardTitle>
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Settings />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  {/*<DropdownMenuLabel>Reset Time</DropdownMenuLabel>*/}
                  <DropdownMenuItem onClick={handleResetTime}>
                    Reset Time
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleResetScore}>
                    Reset Score
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      Set Period Count
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {/*
                          adjust the options based on the number of periods
                          add select for period count
                        */}
                        <DropdownMenuRadioGroup
                          value={state?.period_count?.toString() ?? "4"}
                          onValueChange={handleChangePeriodCount}
                        >
                          <DropdownMenuLabel>Period Count</DropdownMenuLabel>
                          <DropdownMenuRadioItem value="2">
                            2 periods (H1, H2)
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="4">
                            4 periods (Q1, Q2, Q3, Q4)
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      Set Period Duration
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup
                          value={state?.period_duration?.toString() ?? "600"}
                          onValueChange={handleChangePeriodLimit}
                        >
                          <DropdownMenuLabel>Period Duration</DropdownMenuLabel>
                          <DropdownMenuRadioItem value="600">
                            10 minutes
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="1500">
                            25 minutes
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsMatchModalOpen(true)}>
                    Set Match
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>
        <CardContent>
          <ToggleGroup
            type="single"
            size="lg"
            value={state?.period.toString() ?? "1"}
            variant="outline"
            spacing={2}
            onValueChange={handleChangePeriod}
          >
            {state?.period_count === 4 && (
              <>
                <ToggleGroupItem value="1" className="size-16">
                  Q1
                </ToggleGroupItem>
                <ToggleGroupItem value="2" className="size-16">
                  Q2
                </ToggleGroupItem>
                <ToggleGroupItem value="3" className="size-16">
                  Q3
                </ToggleGroupItem>
                <ToggleGroupItem value="4" className="size-16">
                  Q4
                </ToggleGroupItem>
                <ToggleGroupItem value="5" className="size-16">
                  GG
                </ToggleGroupItem>
              </>
            )}
            {state?.period_count === 2 && (
              <>
                <ToggleGroupItem value="1" className="size-16">
                  H1
                </ToggleGroupItem>
                <ToggleGroupItem value="2" className="size-16">
                  H2
                </ToggleGroupItem>
                <ToggleGroupItem value="3" className="size-16">
                  GG
                </ToggleGroupItem>
              </>
            )}
          </ToggleGroup>
        </CardContent>
      </Card>

      <Dialog open={isMatchModalOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Choose a match</DialogTitle>
            <DialogDescription>
              Once selected the teams will be loaded into the scoreboard and
              their names will be displayed.
            </DialogDescription>
          </DialogHeader>
          <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
            <form
              onSubmit={form.handleSubmit(handleMatchSelect)}
              id="matchId-form"
            >
              <FieldGroup>
                <Controller
                  name="match"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FieldSet data-invalid={fieldState.invalid}>
                      <RadioGroup
                        name={field.name}
                        value={field.value?.toString()}
                        onValueChange={field.onChange}
                        aria-invalid={fieldState.invalid}
                      >
                        {matchList.map((match) => (
                          <FieldLabel
                            key={match.id}
                            htmlFor={`matchId-form-radiogroup-${match.id}`}
                          >
                            <Field
                              orientation="horizontal"
                              data-invalid={fieldState.invalid}
                            >
                              <FieldContent>
                                <FieldTitle>
                                  {match.home_team.name} -{" "}
                                  {match.away_team.name}
                                </FieldTitle>
                                <FieldDescription>
                                  {/*{match.date.getDate()}.{" "}*/}
                                  {Intl.DateTimeFormat("en-GB", {
                                    day: "numeric",
                                    month: "long",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }).format(match.date)}{" "}
                                  ({match.id})
                                </FieldDescription>
                              </FieldContent>
                              <RadioGroupItem
                                value={match.id.toString()}
                                id={`matchId-form-radiogroup-${match.id}`}
                                aria-invalid={fieldState.invalid}
                              />
                            </Field>
                          </FieldLabel>
                        ))}
                      </RadioGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldSet>
                  )}
                />
              </FieldGroup>
            </form>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              onClick={handleMatchModalClose}
            >
              Cancel
            </Button>
            <Button type="submit" form="matchId-form">
              Select
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MatchSettings;
