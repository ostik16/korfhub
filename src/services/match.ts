import type { Match } from "@/routes/data-server/types";

export const fetchAllMatches = async () => {
  const request = await fetch(
    `http://${window.location.hostname}:3000/api/v1/match/list`,
    { method: "POST" },
  );
  const res = await request.json();
  const formatted: Match[] = res.map((m: any) => ({
    ...m,
    date: new Date(m.date),
  }));
  return formatted as Match[];
};
