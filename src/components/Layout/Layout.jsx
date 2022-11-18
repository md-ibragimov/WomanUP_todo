import React from 'react';
import { Outlet } from 'react-router-dom'

function Layout(props) {
  return (
    <>
      <header>hi!</header>
      <Outlet />
      <footer>2021</footer>
    </>
  );
}

export default Layout;