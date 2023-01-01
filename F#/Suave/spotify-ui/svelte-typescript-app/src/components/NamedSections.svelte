<script lang="ts">
  import { makeApiService } from '../services/api';
  import { setApiService } from '../utils/contexts';
  import PlaylistTracks from './PlaylistTracks/PlaylistTracks.svelte';
  import TrackSearch from './TrackSearch/TrackSearch.svelte';

  export let name: string;

  setApiService(makeApiService(name));
</script>

<p>Welcome {name}</p>
<PlaylistTracks />
<TrackSearch />
