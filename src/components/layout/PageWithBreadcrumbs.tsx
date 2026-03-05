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
import { Fragment } from "react/jsx-runtime";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const PageWithBreadcrumbs = ({ children, className }: Props) => {
  const { pathname } = useLocation();
  const crumbs = pathname.split("/").filter(Boolean);
  const currentLocation = crumbs.pop();

  // Build the path incrementally for each crumb
  const buildPath = (index: number) => {
    return "/" + crumbs.slice(0, index + 1).join("/");
  };

  return (
    <div className={cn("min-h-screen bg-background p-4 lg:p-6", className)}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumbs */}
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

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
};

export default PageWithBreadcrumbs;
