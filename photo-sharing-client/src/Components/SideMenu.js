import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import LogoutButton from '../Components/Login/LogoutButton';
import { useNavigate } from 'react-router-dom';

const SideMenu = () => {
  const menuItems = ['Folders', 'Albums', 'Manage', 'Favorite'];

  const navigate = useNavigate();

  const handlePostLogout = () => {
    // Redirect to login after logging out
    navigate("/login");
    alert('Successfully logged out!');
  };

  return (
    <List component="nav">
      {menuItems.map((item, index) => (
        <ListItem button key={index}>
          <ListItemText primary={item} />
        </ListItem>
      ))}
      <LogoutButton onLogout={ handlePostLogout } />
    </List>
  );
}

export default SideMenu;
