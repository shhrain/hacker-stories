import styles from './App.module.css';
import InputWithLabel from './InputWithLabel'

type SearchFormProps = {
  searchTerm: string;
  onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
} 

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }: SearchFormProps) => (
  <form onSubmit={onSearchSubmit} className={styles.searchForm}>
    <InputWithLabel id="search" value={searchTerm} isFocused onInputChange={onSearchInput} >
      <strong>Search：</strong>
    </InputWithLabel>
    <button type="submit" disabled={!searchTerm} className={`${styles.button} ${styles.buttonLarge}`} >Submit</button>
  </form>
)

export default SearchForm;