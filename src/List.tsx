
import { useState } from 'react';
import { sortBy } from 'lodash';
import styles from './App.module.css';
import { ReactComponent as Check } from './check.svg';
import { Story, Stories } from './App';

type ItemProps = {
  item: Story;
  onRemoveItem: (item: Story) => void;
}

type ListProps = {
  list: Stories;
  onRemoveItem: (item: Story) => void;
}
// type SortState = {
//   sortKey: string,
//   isReverse: boolean
// }

type Sorts = {
  [NONE:string]: (list: Stories) => Array<Story>;
  TITLE: (list: Stories) => Array<Story>;
  AUTHOR: (list: Stories) => Array<Story>;
  COMMENT: (list: Stories) => Array<Story>;
  POINT: (list: Stories) => Array<Story>;
}

const SORTS :Sorts = {
  NONE: (list:Stories) => list,
  TITLE: (list:Stories) => sortBy(list, 'title'),
  AUTHOR: (list:Stories) => sortBy(list, 'author'),
  COMMENT: (list:Stories) => sortBy(list, 'num_comments').reverse(),
  POINT: (list:Stories) => sortBy(list, 'points').reverse(),
}

const List = ({ list, onRemoveItem }: ListProps) => {
  const [sort, setSort] = useState({
    sortKey: 'NONE',
    isReverse:false
  });
  const handleSort = (sortKey:any) => {
    const isReverse = sort.sortKey === sortKey && !sort.isReverse
    setSort({ sortKey, isReverse });
  }
  const sortFunction = SORTS[sort.sortKey];
  const sortedList = sort.isReverse ?
    sortFunction(list).reverse()
    : sortFunction(list);
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <span style={{ width: '40%' }}>
          <button type="button" onClick={() => handleSort('TITLE')}>Title</button>
        </span>
        <span style={{ width: '30%' }}>
          <button type="button" onClick={() => handleSort('AUTHOR')}>Author</button>
        </span>
        <span style={{ width: '10%' }}>
          <button type="button" onClick={() => handleSort('COMMENT')}>Comments</button>
        </span>
        <span style={{ width: '10%' }}>
          <button type="button" onClick={() => handleSort('POINT')}>Points</button>
        </span>
        <span style={{ width: '10%' }}>
          Actions
        </span>
      </div>
  
      {sortedList.map((item) => <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />)}
    </div>
  );
}

const Item = ({ item, onRemoveItem }: ItemProps ) => {
  
  return (
    <div className={styles.item}>
      <span style={{width:'40%'}}>
        <a href={item.url}>{item.title}</a>
      </span>
      <span style={{width:'30%'}}>{item.author}</span>
      <span style={{width:'10%'}}>{item.num_comments}</span>
      <span style={{width:'10%'}}>{item.points}</span>
      <span style={{width:'10%'}}>
        <button type="button" className={`${styles.button} ${styles.buttonSmall}`} onClick={()=> onRemoveItem(item)}>
          <Check height="18px" width="18px" />
        </button>
      </span>
    </div>
  );
}

export default List;