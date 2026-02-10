import {
  CreateEventRequestSchema,
  ListMatchEventsRequestSchema,
  type CardType,
  type CreateEvent,
  type Event,
  type EventId,
  type ListMatchEventsRequest,
  type ScoreType,
} from "@/routes/data-server/types";

export const listMatchEvents = async (
  payload: Partial<ListMatchEventsRequest>,
): Promise<Event[]> => {
  ListMatchEventsRequestSchema.parse(payload);
  const body = JSON.stringify({
    ...payload,
  });

  const request = await fetch(
    `http://${window.location.hostname}:3000/api/v1/event/match-detail`,
    { method: "POST", body },
  );

  const res = await request.json();
  return res;
};

export const deleteEvent = async (id: EventId) => {
  await fetch(`http://${window.location.hostname}:3000/api/v1/event/${id}`, {
    method: "DELETE",
  });
};

export const createScoreEvent = async (
  payload: Pick<CreateEvent, "match" | "team" | "match_time">,
  type?: ScoreType,
) => {
  const body = JSON.stringify({
    ...payload,
    type: "score",
    score_type: type ?? null,
  });

  return await createEvent(body);
};

export const createTimeoutEvent = async (
  payload: Pick<CreateEvent, "match" | "team" | "match_time">,
) => {
  const body = JSON.stringify({
    ...payload,
    type: "timeout",
  });

  return await createEvent(body);
};

export const createCardEvent = async (
  payload: Pick<CreateEvent, "match" | "team" | "match_time">,
  type?: CardType,
) => {
  const body = JSON.stringify({
    ...payload,
    type: "card",
    card_type: type ?? null,
  });

  return await createEvent(body);
};

export const createSubEvent = async (
  payload: Pick<CreateEvent, "match" | "team" | "match_time">,
) => {
  const body = JSON.stringify({
    ...payload,
    type: "substitution",
  });

  return await createEvent(body);
};

const createEvent = async (body: string) => {
  const request = await fetch(
    `http://${window.location.hostname}:3000/api/v1/event/create`,
    { method: "POST", body },
  );
  const res = await request.json();
  return res;
};
