import { GlobalContext } from "@/App";
import { useContext } from "react";

const PV = () => {
  const { state } = useContext(GlobalContext);

  return (
    <div>
      <div id="home">
        <span>HOME</span>
        <span>{state?.score_home}</span>
      </div>
      <div id="away">
        <span>AWAY</span>
        <span>{state?.score_away}</span>
      </div>
      <div id="time">
        <span>{state?.period}</span>
        <span>{state?.time_remaining_formatted}</span>
      </div>
    </div>
  );
};

export default PV;
