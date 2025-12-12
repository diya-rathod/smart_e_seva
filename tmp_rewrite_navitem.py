from pathlib import Path
path = Path('frontend/src/components/ui/NavItem.jsx')
path.write_text("""import React from \"react\";
import { NavLink, useMatch, useResolvedPath } from \"react-router-dom\";

const NavItem = ({ label, to, icon: Icon }) => {
  const resolvedPath = useResolvedPath(to);
  const match = useMatch({ path: resolvedPath.pathname, end: true });
  const isActive = Boolean(match);

  const baseClasses =
    \"group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 hover:-translate-x-0.5\";
  const activeClasses =
    \"bg-emerald-500/10 text-emerald-600 shadow-[0_2px_6px_rgba(0,0,0,0.06)]\";
  const inactiveClasses =
    \"text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white\";

  return (
    <NavLink
      to={to}
      className={${baseClasses} }
    >
      <span className=\"h-5 w-5 text-slate-500 transition duration-200 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-white\">
        <Icon className=\"h-full w-full\" />
      </span>
      {label}
      <span
        className={pointer-events-none absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-emerald-500 transition duration-200 }
      />
    </NavLink>
  );
};

export default NavItem;
""", encoding=\"utf-8\")
