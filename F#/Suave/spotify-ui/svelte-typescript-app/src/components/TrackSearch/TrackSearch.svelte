<script lang="ts">
  import { apiService } from '../../services/api';
  import SearchResults from './SearchResults.svelte';
  import { trackSearchStore } from './stores';

  const store = trackSearchStore(apiService);

  const onInputChange = (e: any) => {
    const value = e.target?.value;

    if (value !== undefined) {
      store.textSearchNext(value);
    }
  };
</script>

<h2>Track search</h2>
<input on:keyup={onInputChange} />
<SearchResults searchResults={$store} />
