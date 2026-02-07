import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router";
import { NavLink } from "react-router";
import { Outlet } from "react-router";
import { Fragment } from "react/jsx-runtime";

const Controller = () => {
  const { pathname } = useLocation();
  const crumbs = pathname.split("/");
  const currentLocation = crumbs.pop();

  return (
    <div>
      <div className={cn("invisible md:visible")}>
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((crumb) => (
              <Fragment key={crumb}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <NavLink to={`/${crumb}`}>
                      {crumb === "" ? "home" : crumb}
                    </NavLink>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </Fragment>
            ))}
            <BreadcrumbItem>
              <BreadcrumbPage>{currentLocation}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="@container/main flex flex-1 flex-col gap-2">
        <Outlet />
      </div>
    </div>
  );
};

export default Controller;
