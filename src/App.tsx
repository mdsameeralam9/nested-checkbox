import React from 'react';
import nestedCheckboxData from './components/data';
import NestedCheckboxTree from './components/NestedCheckBox';


const App = () => {
  return (
    <div>
      <h2>Nested Checkbox Tree</h2>
      <NestedCheckboxTree data={nestedCheckboxData} />
    </div>
  );
};

export default App;
