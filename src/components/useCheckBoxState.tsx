import { useState } from 'react';
import nestedCheckboxData from './data';
import type { NestedItem } from './data';

type CheckBoxState = Record<string, boolean>;

const useCheckBoxState = () => {
  const [checkedItems, setCheckedItems] = useState<CheckBoxState>({});

  const modifyChildState = (
    isChecked: boolean,
    currentState: CheckBoxState,
    childNodeTree: NestedItem[]
  ): void => {
    childNodeTree.forEach(cnode => {
      currentState[cnode.id] = isChecked;
      if (cnode.children) {
        modifyChildState(isChecked, currentState, cnode.children);
      }
    });
  };

  const updateParent = (
    nodeTree: NestedItem[],
    searchId: string
  ): NestedItem | undefined => {
    for (const childNode of nodeTree) {
      if (!childNode.children) continue;

      const isParent = childNode.children.find(cNode => cNode.id === searchId);
      if (isParent) {
        return childNode;
      }

      const result = updateParent(childNode.children, searchId);
      if (result) return result;
    }
    return undefined;
  };

  const handleCheckBoxState = (id: string, isChecked: boolean): void => {
    const copyCurrentState: CheckBoxState = { ...checkedItems };

    // Set current node
    copyCurrentState[id] = isChecked;

    // Update children
    const updateChild = (nodeTree: NestedItem[]): void => {
      nodeTree.forEach(ndChild => {
        if (ndChild.id === id) {
          if (ndChild.children) {
            modifyChildState(isChecked, copyCurrentState, ndChild.children);
          }
        } else if (ndChild.children?.length) {
          updateChild(ndChild.children);
        }
      });
    };

    updateChild(nestedCheckboxData);

    // Update parents
    let currentId = id;
    let parentNode = updateParent(nestedCheckboxData, currentId);

    while (parentNode) {
      copyCurrentState[parentNode.id] = isChecked;
      currentId = parentNode.id;
      parentNode = updateParent(nestedCheckboxData, currentId);
    }

    setCheckedItems(copyCurrentState);
  };

  return { checkedItems, handleCheckBoxState };
};

export default useCheckBoxState;
