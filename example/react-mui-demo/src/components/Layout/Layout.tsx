import { NavLink, Outlet } from "react-router-dom"
import { Typography, AppBar, Toolbar } from "@mui/material"

const Link: React.FC<{ to: string; label: string }> = ({ to, label }) => {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        color: isActive ? "#fff" : "#ccc",
        textDecoration: "none",
        marginRight: 25,
      })}
    >
      <Typography variant="h6">{label}</Typography>
    </NavLink>
  )
}

const PageLayout: React.FC = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Link to="/documents" label="Documents" />
          <Link to="/categories" label="Categories" />
          <Link to="/users" label="Users" />
          <Link to="/fileTypes" label="File Types" />
        </Toolbar>
      </AppBar>
      <Outlet />
    </>
  )
}

export default PageLayout
