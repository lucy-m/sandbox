<script lang="ts">
  import { makeApiService } from '../services/api';
  import { setApiService, setUserName } from '../utils/contexts';
  import { raiseToast } from './common/toastStore';
  import PlaylistTracks from './PlaylistTracks/PlaylistTracks.svelte';
  import TrackSearch from './TrackSearch/TrackSearch.svelte';

  export let name: string;

  setApiService(makeApiService(name, raiseToast));
  setUserName(name);

  const showMessage = (msg: string) => {
    raiseToast(msg);
  };
</script>

<p>Welcome {name}</p>
<button on:click={() => showMessage('Hello toast')}>Click</button>
<PlaylistTracks />
<TrackSearch />
