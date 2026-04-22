'use client';

import Panel from './panel/panel';
import ExpensaList from './expensa/list';

const Layout = () => {
  return (
    <div className='mt-3'>
      <Panel />
      <ExpensaList />
    </div>
  );
};

export default Layout;
