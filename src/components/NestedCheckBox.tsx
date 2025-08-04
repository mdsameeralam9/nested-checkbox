import React, { useState } from 'react';
import useCheckBoxState from './useCheckBoxState';


export type NestedItem = {
  id: string;
  name: string;
  children?: NestedItem[];
};

type Props = {
  data: NestedItem[];
};

const NestedCheckboxTree: React.FC<Props> = ({ data }) => {
  const { checkedItems,  handleCheckBoxState } = useCheckBoxState()

  const handleCheck = (id: string, isChecked:boolean) => {
    handleCheckBoxState(id, isChecked);
  };

  const renderTree = (items: NestedItem[], level = 0) => {
    return (
      <ul className={`level-${level}`}>
        {items.map(item => (
          <li key={item.id}>
            <label>
              <input
                type="checkbox"
                checked={!!checkedItems[item.id]}
                onChange={(e) => handleCheck(item.id, e.target.checked)}
              />
              {item.name}
            </label>
            {item.children && renderTree(item.children, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  return <div className="nested-checkbox-tree">{renderTree(data)}</div>;
};

export default NestedCheckboxTree;
