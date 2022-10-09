
import React,{
  useState,
  useEffect,
  useCallback,
  useRef,
  useReducer,
  useMemo
} from 'react';
import axios from 'axios';

import styles from './App.module.css';

import List from './List';
import SearchForm from './SearchForm';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

export type Story = {
  objectID: string;
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
}


export type Stories = Array<Story>;
 
type StoriesState = {
  data: Stories;
  isLoading: boolean;
  isError: boolean;
};

interface StoriesFetchInitAction {
  type: 'STORIES_FETCH_INIT';
}
interface StoriesFetchSuccessAction {
  type: 'STORIES_FETCH_SUCCESS';
  payload: Stories;
}
interface StoriesFetchFailureAction {
  type: 'STORIES_FETCH_FAILURE';
}

interface StoriesRemoveAction {
  type: 'REMOVE_STORY';
  payload: Story;
}

type StoriesAction =
| StoriesFetchInitAction
| StoriesFetchSuccessAction
| StoriesFetchFailureAction
| StoriesRemoveAction


const App = () => {
  
 
  
  const [stories, dispatchStories] = useReducer(
    storiesReducer,
    {
      data: [],
      isLoading: false,
      isError: false,
    }
  );
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');
  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);
  const handleFetchStories = useCallback( async () => {
    
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    try {
      const result = await axios.get(url);
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [url]);
  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = useCallback((item:Story) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item
    })
  }, []);

  
  const handleSearchInput = (event:React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  const handleSearchSubmit = (event:React.FormEvent<HTMLFormElement>) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  }
  const sumComments = useMemo(()=>getSumComments(stories),[stories]);
  return (
    <div className={styles.container}>
      <h1 className={styles.headlinePrimary}>My Hacker Stories with { sumComments } comments</h1> 
      
      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />
    
      {stories.isError && <p>Someting went wrong ...</p>}
      {stories.isLoading?(<p>Loading...</p>):(<List list={stories.data} onRemoveItem={handleRemoveStory} />)}
    </div>
  );
}








const storiesReducer = (state:StoriesState, action:StoriesAction) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError:false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      }
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      }
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          story => action.payload.objectID !== story.objectID
        )
      }
    default:
      throw new Error();
  }
}

const useSemiPersistentState = (key:string, initialState:string):[string,(newValue:string)=>void] => {
  const isMounted = useRef(false);
  const [value, setValue] = useState(
    localStorage.getItem(key) || initialState
  );
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      
      localStorage.setItem(key, value);
    }
    
  }, [value, key]);
  
  return [value, setValue];
}

const getSumComments = (stories:StoriesState) => {
  
  return stories.data.reduce((result, value) => result + value.num_comments, 0);
} 
  
export default App;
