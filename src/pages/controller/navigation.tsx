import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import { NavLink } from "react-router";

const ControlsNavigation = () => {
  return (
    <div className="p-4">
      <ButtonGroup>
        <Button variant="secondary">
          <NavLink to="/controller/basic">Basic Controller</NavLink>
        </Button>
        <ButtonGroupSeparator />
        <Button variant="secondary">
          <NavLink to="/controller/advanced">Advanced Controller</NavLink>
        </Button>
        <ButtonGroupSeparator />
        <Button variant="secondary">
          <NavLink to="/controller/event">Event Controller</NavLink>
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default ControlsNavigation;
