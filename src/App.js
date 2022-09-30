import './App.css';
import { useState, useEffect, useRef} from 'react';
const welcome = {
  greeting: 'Hey',
  title: 'React'
};
const App = () => {
  const initialStories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];
  
  const [stories, setStories] = useState(initialStories);

  const handleRemoveStory = item => {
    const newStories = stories.filter(story => item.objectID !== story.objectID);
    setStories(newStories);
  }

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search','React');
  const handleSearch = (event) => {
    console.log("子组件传递：", event.target.value);
    setSearchTerm(event.target.value);
    localStorage.setItem('search', event.target.value);
  };
  const searchedStories = stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()));
  return (
    <div className='App'>
      <h1>{welcome.greeting} {welcome.title}</h1>  
      <InputWithLabel id="search" value={searchTerm} isFocused onInputChange={handleSearch} >
        <strong>搜索：</strong>
      </InputWithLabel>
      <p>Search for : <i>{searchTerm}</i></p>
      <hr />
      <List list={searchedStories} onRemoveItem={handleRemoveStory} />
    </div>
  );
}
const InputWithLabel = ({ id, value, type = 'text', isFocused ,onInputChange, children }) => {
  const inputRef = useRef();
  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);
  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input ref={inputRef} id={id} type={type} value={value} onChange={onInputChange} />
    </>
  );
}


const List = ({ list, onRemoveItem }) => list.map((item) => <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />);
const Item = ({ item, onRemoveItem }) => {
  const handleRemoveItem = () => {
    onRemoveItem(item)
  };
  return (
    <div>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type="button" onClick={handleRemoveItem}>
          Dismiss
        </button>
      </span>
    </div>
  );
}

const useSemiPersistentState = (key,initialState) => {
  const [value, setValue] = useState(
    localStorage.getItem(key) || initialState
  );
  useEffect(() => {
    localStorage.setItem(key, value)
  }, [value,key]);
  return [value, setValue];
}
  
export default App;
