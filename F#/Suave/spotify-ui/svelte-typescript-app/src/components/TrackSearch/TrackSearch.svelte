<script lang="ts">
  import { useApiService } from '../../utils/contexts';
  import SearchResults from './SearchResults.svelte';
  import { trackSearchStore } from './stores';

  const apiService = useApiService();
  const store = trackSearchStore();

  const onInputChange = (e: any) => {
    const value = e.target?.value;

    if (value !== undefined) {
      store.textSearchNext(value);
    }
  };

  const onAdd = (uri: string) => {
    apiService.addTrack(uri);
  };
</script>

<h2>Track search</h2>
<input on:keyup={onInputChange} />
<SearchResults searchResults={$store} {onAdd} />
