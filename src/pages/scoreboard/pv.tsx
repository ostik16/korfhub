import { GlobalContext } from "@/App";
import { useContext } from "react";

const PV = () => {
  const { state } = useContext(GlobalContext);

  return (
    <div>
      <div id="home" className="flex">
        <div>{state?.home_name}</div>
        <div>{state?.home_score}</div>
        <div className="flex flex-col">
          <div
            style={{
              background: state?.home_colors[0],
              width: 3,
              height: "50%",
            }}
          ></div>
          <div
            style={{
              background: state?.home_colors[1],
              width: 3,
              height: "50%",
            }}
          ></div>
        </div>
      </div>
      <div id="away">
        <span>{state?.away_name}</span>
        <span>{state?.away_score}</span>
      </div>
      <div id="time">
        <span>{state?.period}</span>
        <span>{state?.time_remaining_formatted}</span>
      </div>
      id: {state?.matchId}
    </div>
  );
};

export default PV;
