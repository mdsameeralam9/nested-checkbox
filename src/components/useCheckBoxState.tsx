import { useState } from 'react'
import nestedCheckboxData from './data';
import type { NestedItem } from './data';

type checkBoxState = Record<string, boolean>

const useCheckBoxState = () => {
  const [checkedItems, setCheckedItems] = useState<checkBoxState>({});

  const modifyChildState = (isChecked: boolean, currentState: checkBoxState, childNodeTree: []): {} => {
    childNodeTree?.forEach(cnode => {
      currentState[cnode.id] = isChecked;
      if (cnode?.children) {
        modifyChildState(isChecked, currentState, cnode.children)
      }
    })
  }

  const handleCheckBoxState = (id: string, isChecked: boolean) => {
    const copyCurrentState = { ...checkedItems };
    // current id 
    copyCurrentState[id] = isChecked;

    // using id find its child and child`s child
    const updateChild = (nodeTree: NestedItem) => {
      nodeTree?.forEach(ndChild => {
        if (ndChild.id === id) {
          if(!ndChild.children) return
           modifyChildState(isChecked, copyCurrentState, ndChild.children)
        } else {
          if (ndChild.children?.length > 0) {
            updateChild(ndChild.children)
          }
        }

      })
    }
    updateChild(nestedCheckboxData)

    const updateParent = (nodeTree: NestedItem) => {
      nodeTree.forEach(childNode => {
        if(!childNode.children) return false;
        const isParent = childNode?.children?.find(cNode => cNode.id === id);
        if(isParent){
          console.log(childNode)
          return childNode
        }
        updateParent(childNode?.children)
      })
    }

   
    let parentNode = updateParent(nestedCheckboxData);
    console.log(parentNode)
    while(parentNode){
       
      copyCurrentState[parentNode.id] = isChecked;
      parentNode = updateParent(parentNode.children)
    }


    setCheckedItems(copyCurrentState);
  }

  return { checkedItems, handleCheckBoxState }
}

export default useCheckBoxState