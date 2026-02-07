import { GlobalContext } from "@/App";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Kbd } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, ClockPlus, Space } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
} from "@/components/ui/field";
import { type Match } from "@/routes/data-server/types";
import { fetchAllMatches } from "@/services/match";
import { match } from "@/routes/scoreboard-server/match";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({ match: z.number() });

const AdvancedController = () => {
  const { state, webSocketControls } = useContext(GlobalContext);

  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [matchList, setMatchList] = useState<Match[]>([]);

  const form = useForm({
    defaultValues: { match: matchList[0]?.slug },
  });

  useEffect(() => {
    if (matchList.length) return;
    fetchAllMatches().then((m) => setMatchList(m));
  }, [isMatchModalOpen]);

  const isTimeRunning = !!state?.time_started_at;

  function handleTime() {
    return isTimeRunning
      ? webSocketControls?.stopTime()
      : webSocketControls?.startTime();
  }

  function handleAdjustTime(time: number) {
    webSocketControls?.adjustTime(time);
  }

  function handleResetTime() {
    return webSocketControls?.resetTime();
  }

  function handleResetScore() {
    webSocketControls?.resetScore();
  }

  function handleChangePeriod(period: string) {
    webSocketControls?.setPeriod(period);
  }

  function handleChangeHomeScore(score: number) {
    webSocketControls?.setHomeScore(score);
  }

  function handleChangeAwayScore(score: number) {
    webSocketControls?.setAwayScore(score);
  }

  function handleMatchModalClose() {
    setIsMatchModalOpen(false);
  }

  function handleMatchSelect(e: any) {
    setIsMatchModalOpen(false);
    webSocketControls?.setMatch(e.match);
  }

  return (
    <>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @4xl/main:grid-cols-3">
        {/* TIME */}
        <div className="flex flex-col gap-4">
          <Card className="@container/card">
            <CardHeader>
              <CardTitle
                className={cn(
                  "font-semibold tabular-nums text-6xl",
                  isTimeRunning ? "text-inherit" : "text-red-400",
                )}
              >
                {state?.time_remaining_formatted}
              </CardTitle>
              <CardAction>
                <Badge variant="secondary">{state?.period}</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <Button
                variant="default"
                block
                onClick={handleTime}
                className="uppercase h-25"
              >
                {isTimeRunning ? "stop" : "start"}
              </Button>
            </CardContent>
            <CardContent>
              {/*
              add timeout for the tip so that it disappears when used or after some time
              also hide when the device is a mobile phone or similar without a keyboard
              */}
              <span className="text-gray-500">
                Tip: you can press{" "}
                <Kbd>
                  <Space />
                </Kbd>{" "}
                to toggle the time
              </span>
            </CardContent>
            <CardContent>
              <Separator />
            </CardContent>
            <CardContent>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Match settings</Button>
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
                        Set Period
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuRadioGroup
                            value={state?.period.toString()}
                            onValueChange={handleChangePeriod}
                          >
                            <DropdownMenuRadioItem value="Q1">
                              Q1
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Q2">
                              Q2
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Q3">
                              Q3
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Q4">
                              Q4
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="H1">
                              H1
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="H2">
                              H2
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="GG">
                              GG
                            </DropdownMenuRadioItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>More...</DropdownMenuItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem onClick={() => setIsMatchModalOpen(true)}>
                      Set Match
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>

          <Card className="@container/card">
            <CardHeader>
              <CardTitle>Adjust Time</CardTitle>
              <CardAction>
                <ClockPlus size={18} />
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => handleAdjustTime(5)}>
                  +5s
                </Button>
                <Button variant="outline" onClick={() => handleAdjustTime(1)}>
                  +1s
                </Button>
                <Button variant="outline" onClick={() => handleAdjustTime(-5)}>
                  -5s
                </Button>
                <Button variant="outline" onClick={() => handleAdjustTime(-1)}>
                  -1s
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/*<div className="col-span-2 grid grid-cols-11 m-6">
        <div className="col-span-5 grid grid-cols-5">
          <span className="col-span-4">{state?.home_team.name}</span>
          <span>
            <Card className="@container/card inline p-6">
              {state?.home_score}
            </Card>
          </span>
        </div>
        <div className="text-center">-</div>
        <div className="col-span-5 grid grid-cols-5">
          <span>
            <Card className="@container/card inline p-6">
              {state?.away_score}
            </Card>
          </span>
          <span className="col-span-4 text-right">{state?.away_team.name}</span>
        </div>
      </div>*/}

        <div
          className="col-span-2 grid grid-cols-2 gap-8"
          style={
            {
              "--home-gradient": `90deg,${state?.home_team.colors[0]},${state?.home_team.colors[1]}`,
              "--away-gradient": `90deg,${state?.away_team.colors[0]},${state?.away_team.colors[1]}`,
            } as React.CSSProperties
          }
        >
          <div className="flex flex-col gap-4">
            <div
              id="home-color-strip"
              className={cn("bg-linear-(--home-gradient) h-1 rounded-sm")}
            ></div>
            <span className="text-2xl text-center">
              {state?.home_team.name}
            </span>
            <div className="flex flex-col items-center gap-1">
              <Button
                onClick={() => handleChangeHomeScore(1)}
                variant="outline"
                className="w-25"
              >
                <ChevronUp />
              </Button>
              <Card className="@container/card inline p-6 text-4xl w-25 text-center">
                {state?.home_score}
              </Card>
              <Button
                onClick={() => handleChangeHomeScore(-1)}
                variant="outline"
                className="w-25"
              >
                <ChevronDown />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div
              id="away-color-strip"
              className={cn(
                "bg-linear-(--away-gradient) h-1 rounded-sm",
                `from-[${state?.away_team.colors[0]}]`,
                `to-[${state?.away_team.colors[1]}]`,
              )}
            ></div>
            <span className="text-2xl text-center">
              {state?.away_team.name}
            </span>
            <div className="flex flex-col items-center gap-1">
              <Button
                variant="outline"
                className="w-25"
                onClick={() => handleChangeAwayScore(1)}
              >
                <ChevronUp />
              </Button>
              <Card className="@container/card inline p-6 text-4xl w-25 text-center">
                {state?.away_score}
              </Card>
              <Button
                variant="outline"
                className="w-25"
                onClick={() => handleChangeAwayScore(-1)}
              >
                <ChevronDown />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={isMatchModalOpen}>
        {/*<DialogTrigger>Open</DialogTrigger>*/}
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
                        value={field.value}
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
          {/*<RadioGroup defaultValue={matchList[0]?.slug} className="max-w-sm">
            {matchList.map((m) => (
              <FieldLabel htmlFor={m.slug}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>{m.id}</FieldTitle>
                    <FieldDescription>
                      {m.home_team.name} - {m.away_team.name}
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem
                    value={m.slug}
                    id={m.slug}
                    onSelect={() => console.log(m.slug)}
                  />
                </Field>
              </FieldLabel>
            ))}

          </RadioGroup>*/}
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

export default AdvancedController;
