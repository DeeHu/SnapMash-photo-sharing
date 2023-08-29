import React from 'react';
import { List, ListItem, ListItemText, Button } from '@mui/material';
import LogoutButton from '../Components/Login/LogoutButton';
import { useNavigate } from 'react-router-dom';

const SideMenu = () => {
  const menuItems = ['Folders', 'Albums', 'Manage', 'Favorite'];
  const navigate = useNavigate();

  const handlePostLogout = () => {
    // redirect to login after logging out
    navigate("/login");
    // alert('Successfully logged out!');
  };

  const goToOwnDashboard = () => {
    navigate('/dashboard');
  };  

  return (
    <List component="nav">
      {menuItems.map((item, index) => (
        <ListItem button key={index}>
          <ListItemText primary={item} />
        </ListItem>
      ))}
      <div>
        <Button onClick={goToOwnDashboard} variant="contained" style={{ marginTop: '10px' }}>
          My Dashboard
        </Button>
      </div>
      <div>
        <LogoutButton onLogout={ handlePostLogout } />
      </div>
    </List>
  );
}

export default SideMenu;
