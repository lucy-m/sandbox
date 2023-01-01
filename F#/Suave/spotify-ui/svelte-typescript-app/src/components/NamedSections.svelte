<script lang="ts">
  import { makeApiService } from '../services/api';
  import { setApiService, setUserName } from '../utils/contexts';
  import PlaylistTracks from './PlaylistTracks/PlaylistTracks.svelte';
  import TrackSearch from './TrackSearch/TrackSearch.svelte';

  export let name: string;

  const onError = (msg: string) => console.error(msg);

  setApiService(makeApiService(name, onError));
  setUserName(name);
</script>

<p>Welcome {name}</p>
<PlaylistTracks />
<TrackSearch />
