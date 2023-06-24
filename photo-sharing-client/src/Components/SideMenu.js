import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const SideMenu = () => {
  const menuItems = ['Folders', 'Albums', 'Manage', 'Favorite'];

  return (
    <List component="nav">
      {menuItems.map((item, index) => (
        <ListItem button key={index}>
          <ListItemText primary={item} />
        </ListItem>
      ))}
    </List>
  );
}

export default SideMenu;
