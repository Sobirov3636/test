import React from "react";
import "./Search.css";
import { ReactComponent as Logo } from "../../assets/Logo.svg";
import SearchForm from "../../components/SearchForm/SearchForm";
import { AppBar, Box, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { AccountCircle } from "@mui/icons-material";

const Search: React.FC = () => {
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Navigate to the user profile page

  return (
    <div className='search-page'>
      <AppBar
        position='fixed'
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: "rgba(26, 31, 43, 0.62);" }}
      >
        <Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
            <Logo style={{ height: "35px", width: "35px" }} />
            <Typography variant='h6' noWrap component='div'>
              PhnyX RAG
            </Typography>
          </Box>
          {/* <button className='top-profile-button' onClick={() => navigate("/profile")}>
           
          </button> */}

          <div>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleMenu}
              color='inherit'
              sx={{ height: "0px" }}
            >
              <AccountCircle sx={{ height: "40px", width: "40px" }} />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

      {/* Header and Search Section */}
      <div className='header-container'>
        <Box
          sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
        >
          <Logo style={{ fontSize: 80, color: "#4A90E2", marginBottom: 2 }} />
          <Typography variant='h4' sx={{ fontWeight: "bold", marginBottom: 1 }}>
            Start chatting
          </Typography>
          <Typography variant='subtitle1' color='textSecondary'>
            PhnyX RAG에게 무엇이든 물어보세요.
          </Typography>
        </Box>

        <SearchForm />
      </div>
    </div>
  );
};

export default Search;
