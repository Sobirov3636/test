import React from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/Logo.svg";
import FileManager from "../../components/FileManager/FileManager";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Toolbar,
  Typography,
  ListItemButton,
  Box,
  AppBar,
  useMediaQuery,
  MenuItem,
  Menu,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AccountCircle } from "@mui/icons-material";

const Profile: React.FC = () => {
  // const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setAuth(event.target.checked);
  // };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();

  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const drawerWidth = isSmallScreen ? 60 : 300;

  const menuItems = [
    { text: "Overview", icon: <HomeIcon />, onClick: () => navigate("/overview") },
    { text: "Files", icon: <FileCopyIcon />, onClick: () => navigate("/files") },
    { text: "Plans & Billing", icon: <AccountBalanceWalletIcon />, onClick: () => navigate("/billing") },
    { text: "Settings", icon: <SettingsIcon />, onClick: () => navigate("/settings") },
  ];

  const navigateHome = () => {
    navigate("/");
  };

  return (
    <div className='profile-page-container custom-scrollbar'>
      {/* Top Navigation Bar */}
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

      {/* Sidebar Drawer */}
      <Drawer
        variant='permanent'
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#FFF",
            boxShadow: "0px 0px 2vw 0px rgba(0, 0, 0, 0.10)",
            top: "64px",
            overflowX: "hidden",
          },
        }}
      >
        {/* Drawer Content */}
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Menu Items */}
          <List sx={{ marginTop: "50px" }}>
            {menuItems.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={item.onClick}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  {!isSmallScreen && <ListItemText primary={item.text} />}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          {/* Go Back Section */}
          <Box
            sx={{
              position: "absolute",
              bottom: "10%",
              left: 0,
              right: 0,
              padding: 2,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <IconButton
              onClick={navigateHome}
              sx={{
                width: "85%",
                height: 50,
                justifyContent: "center",
                backgroundColor: "#F6F7FA",
                color: "#000",
                borderRadius: 2,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  backgroundColor: "#27065d",
                  color: "white",
                  "& .MuiTypography-root": {
                    color: "white",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "white",
                  },
                },
              }}
            >
              <ArrowBackIcon />
              {!isSmallScreen && (
                <Typography
                  variant='body1'
                  sx={{
                    marginLeft: 1,
                  }}
                >
                  Go Back
                </Typography>
              )}
            </IconButton>
          </Box>
        </Box>
      </Drawer>

      {/* Main Content */}
      <div className='profile-page-body-container' style={{ marginLeft: drawerWidth }}>
        <FileManager />
      </div>
    </div>
  );
};

export default Profile;
