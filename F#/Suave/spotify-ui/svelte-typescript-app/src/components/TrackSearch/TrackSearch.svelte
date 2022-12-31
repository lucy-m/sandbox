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

  const onAdd = (uri: string) => {
    apiService.addTrack('Luce', uri);
  };
</script>

<h2>Track search</h2>
<input on:keyup={onInputChange} />
<SearchResults searchResults={$store} {onAdd} />
