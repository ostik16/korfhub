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
  const crumbs = pathname.split("/").filter(Boolean);
  const currentLocation = crumbs.pop();

  // Build the path incrementally for each crumb
  const buildPath = (index: number) => {
    return "/" + crumbs.slice(0, index + 1).join("/");
  };

  return (
    <div>
      <div className={cn("invisible md:visible")}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <NavLink to="/">home</NavLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {crumbs.length > 0 && <BreadcrumbSeparator />}
            {crumbs.map((crumb, index) => (
              <Fragment key={`${crumb}-${index}`}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <NavLink to={buildPath(index)}>{crumb}</NavLink>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </Fragment>
            ))}
            {currentLocation && (
              <BreadcrumbItem>
                <BreadcrumbPage>{currentLocation}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
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
