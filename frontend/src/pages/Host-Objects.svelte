<script>
  import axios from "axios";


  // TODO: Setze hier die URL zu deinem mit Postman erstellten Mock Server
  const api_root = "http://localhost:8080/api";

  let hostObjects = [];
  let hostObject = {
    name: null,
    ip: null,
    description: null,
  };

  function getHostObjects() {
    var config = {
      method: "get",
      url: api_root + "/host-object",
      headers: {},
    };

    axios(config)
      .then(function (response) {
        hostObjects = response.data;
      })
      .catch(function (error) {
        alert("Could not get Host Objects");
        console.log(error);
      });
  }
  getHostObjects();

  function createHostObject() {
    var config = {
      method: "post",
      url: api_root + "/host-object",
      headers: {
        "Content-Type": "application/json",
      },
      data: hostObject,
    };

    axios(config)
      .then(function (response) {
        alert("Host Object created");
        getHostObjects();
      })
      .catch(function (error) {
        alert("Could not create Host Object");
        console.log(error);
      });
  }


  
  let sortBy = {col: "name", ascending: true};
	
	$: sort = (column) => {
		
		if (sortBy.col == column) {
			sortBy.ascending = !sortBy.ascending
		} else {
			sortBy.col = column
			sortBy.ascending = true
		}
		
		// Modifier to sorting function for ascending or descending
		let sortModifier = (sortBy.ascending) ? 1 : -1;
		
		let sort = (a, b) => 
			(a[column] < b[column]) 
			? -1 * sortModifier 
			: (a[column] > b[column]) 
			? 1 * sortModifier 
			: 0;
		
      hostObjects = hostObjects.sort(sort);
	}



</script>

<div class="container-fluid">
  <div class="row">
    <div class="col">
      <h3 style="margin-top: 15px; font-weight: bold;">All Host Objects</h3>
    </div>
    <div class="col" />
    <div class="col" style="text-align-last: right;">
      <button
        type="button"
        class="btn"
        data-toggle="modal" data-target="#crateHO"
        style="margin-top: 9px; background-color: #c73834; color: #fff"
        >Add Host-Object</button
      >
    </div>
  </div>
</div>
<table class="table table-striped table-hover" id="allHostObjects">
  <thead>
    <tr>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <th scope="col">Name  <span on:click={sort("name")}> <i class="fa fa-fw fa-sort"></i></span></th>
      <th scope="col" on:click={sort("ip")}>IP  <i class="fa fa-fw fa-sort"></i></th>
      <th scope="col" on:click={sort("description")}>Description  <i class="fa fa-fw fa-sort"></i></th>
      <th scope="col" ></th>
      <th scope="col"></th>
    </tr>
  </thead>
  <tbody>
    {#each hostObjects as hostObject}
      <tr>
        <td>{hostObject.name}</td>
        <td>{hostObject.ip}</td>
        <td>{hostObject.description}</td>
        <td><i class="fa fa-pencil-square-o fa-lg" aria-hidden="true"></i></td>
          <td><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></td>
      </tr>
    {/each}
  </tbody>
</table>

<div class="modal fade" id="crateHO" tabindex="-1" role="dialog" aria-labelledby="formCreateHostObject" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="crateHostObject">Add Host-Object</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form class="mb-5">
          <div class="row mb-3">
            <div class="col">
              <label class="form-label" for="name">Name</label>
              <input
                bind:value={hostObject.name}
                class="form-control"
                id="name"
                type="text"
                placeholder="H_<ZONE>_<HOST-NAME>"
              />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label class="form-label" for="ip">IP</label>
              <input
                bind:value={hostObject.ip}
                class="form-control"
                id="ip"
                type="text"
              />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label class="form-label" for="description">Description</label>
              <input
                bind:value={hostObject.description}
                class="form-control"
                id="description"
                type="text"
              />
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn" style="background-color: #008000; color: #fff" on:click={createHostObject}>Add</button>
      </div>
    </div>
  </div>
</div>

<!--------------->
