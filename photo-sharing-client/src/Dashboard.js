import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import imageSrc from './pexels-tanika-3687770.jpg';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

// Citation: https://mui.com/material-ui/react-drawer/
// https://mui.com/material-ui/react-image-list/
const drawerWidth = 240;

function Dashboard() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Photo Viewer
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          {['My Photos', "Shared With Me"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
      <Toolbar />
         <ImageList
          variant="quilted"
          cols={4}
        >
          {itemData.map((item) => (
            <ImageListItem key={item.img} cols={item.cols || 1} rows={item.rows || 1}>
              <img
                {...srcset(item.img, 121, item.rows, item.cols)}
                alt={item.title}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
    </Box>
  );
}

function srcset(image: string, size: number, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

const itemData = [
  {
    img: imageSrc,
    title: 'Dog',
    rows: 1,
    cols: 2,
  },
  {
    img: imageSrc,
    title: 'Dog',
    rows: 2,
    cols: 1,
  },
    {
    img: imageSrc,
    title: 'Dog',
    rows: 1,
    cols: 1,
  },
    {
    img: imageSrc,
    title: 'Dog',
    rows: 1,
    cols: 1,
  },
    {
    img: imageSrc,
    title: 'Dog',
    rows: 1,
    cols: 1,
  },
    {
    img: imageSrc,
    title: 'Dog',
    rows: 1,
    cols: 1,
  },
    {
    img: imageSrc,
    title: 'Dog',
    rows: 1,
    cols: 1,
  },  {
    img: imageSrc,
    title: 'Dog',
    rows: 1,
    cols: 1,
  },  {
    img: imageSrc,
    title: 'Dog',
    rows: 1,
    cols: 1,
  },  {
    img: imageSrc,
    title: 'Dog',
    rows: 1,
    cols: 1,
  },
];

export default Dashboard;
