<script>
  import axios from "axios";
  import HostObjects from "./Host-Objects.svelte";


  // TODO: Setze hier die URL zu deinem mit Postman erstellten Mock Server
  const api_root = "http://localhost:8080/api";

  let networkObjects = [];
  let networkObject = {
    name: null,
    ip: null,
    subnet: null,
    description: null,
  };
  let visibleData;
    let searchText;

    let noEdit = {
    id: null,
    name: null,
    ip: null,
    subnet: null,
    description: null,
  };

  function getNetworkObjects() {
    var config = {
      method: "get",
      url: api_root + "/network-object",
      headers: {},
    };

    axios(config)
      .then(function (response) {
        networkObjects = response.data;
      })
      .catch(function (error) {
        alert("Could not get Network Objects");
        console.log(error);
      });
  }
  getNetworkObjects();

  $: {
      visibleData = searchText ? networkObjects.filter(e => {return e.name.toLowerCase().match(`${searchText.toLowerCase()}.*`) || e.ip.match(`${searchText}.*`) || e.description.toLowerCase().match(`${searchText.toLowerCase()}.*`)}) : networkObjects
    }

  function createNetworkObject() {
    var config = {
      method: "post",
      url: api_root + "/network-object",
      headers: {
        "Content-Type": "application/json",
      },
      data: networkObject,
    };

    axios(config)
      .then(function (response) {
        alert("Network Object created");
        getNetworkObjects();
      })
      .catch(function (error) {
        alert("Could not create Network Object");
        console.log(error);
      });
  }

  function getNoToEdit(no) {
    noEdit.id = no.id;
    noEdit.name = no.name;
    noEdit.ip = no.ip;
    noEdit.subnet = no.subnet
    noEdit.description = no.description;
  }

  function editNo() {
    var config = {
      method: "put",
      url: api_root + "/network-object",
      headers: {
        "Content-Type": "application/json",
      },
      data: noEdit,
    };

    axios(config)
      .then(function (response) {
        getNetworkObjects();
      })
      .catch(function (error) {
        alert("Could not edit Network Object");
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
		
      visibleData = visibleData.sort(sort);
	}



</script>

<div class="container-fluid">
  <div class="row">
    <div class="col">
      <h3 style="margin-top: 15px; font-weight: bold;">Network Objects</h3>
    </div>
    <div class="col" />
    <div class="col" style="text-align-last: right;">
      <button
        type="button"
        class="btn"
        data-toggle="modal" data-target="#crateHO"
        style="margin-top: 9px; background-color: #c73834; color: #fff"
        >Add Network-Object</button
      >
    </div>
  </div>
  <div class="row g-3">
    <div class="col">
  <input
    bind:value={searchText}
    class="form-control"
    id="search"
    type="text"
    style="margin-bottom: 10px;"
    placeholder="search..."
  />
</div>
<div class="col"/>
<div class="col"/>
<div class="col"/>
</div>  
</div>
<table class="table table-striped table-hover" id="allHostObjects">
  <thead>
    <tr>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <th scope="col">Name  <span on:click={sort("name")}> <i class="fa fa-fw fa-sort"></i></span></th>
      <th scope="col" on:click={sort("ip")}>IP  <i class="fa fa-fw fa-sort"></i></th>
      <th scope="col" on:click={sort("subnet")}>Subnet  <i class="fa fa-fw fa-sort"></i></th>
      <th scope="col" on:click={sort("description")}>Description  <i class="fa fa-fw fa-sort"></i></th>
      <th scope="col" ></th>
      <th scope="col"></th>
    </tr>
  </thead>
  <tbody>
    {#each visibleData as networkObject}
      <tr>
        <td>{networkObject.name}</td>
        <td>{networkObject.ip}</td>
        <td>{networkObject.subnet}</td>
        <td>{networkObject.description}</td>
        <td><button
          style="border: none; background: none;"
          data-toggle="modal"
          data-target="#editNO"
          on:click={() => getNoToEdit(networkObject)}
          ><i
            class="fa fa-pencil-square-o fa-lg"
            aria-hidden="true"
          /></button
        ></td>
          <td><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></td>
      </tr>
    {/each}
  </tbody>
</table>

<div class="modal fade" id="crateHO" tabindex="-1" role="dialog" aria-labelledby="formCreateHostObject" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="crateHostObject">Add Network-Object</h5>
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
                bind:value={networkObject.name}
                class="form-control"
                id="name"
                type="text"
                placeholder="N_<ZONE>_<NETZWERK-NAME>"
              />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label class="form-label" for="ip">IP</label>
              <input
                bind:value={networkObject.ip}
                class="form-control"
                id="ip"
                type="text"
              />
            </div>
          </div>
            <div class="row mb-3">
              <div class="col">
                <label class="form-label" for="subnet">Subent</label>
                <input
                  bind:value={networkObject.subnet}
                  class="form-control"
                  id="subnet"
                  type="text"
                />
              </div>
            </div>
              <div class="row mb-3">
            <div class="col">
              <label class="form-label" for="description">Description</label>
              <input
                bind:value={networkObject.description}
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
        <button type="button" class="btn" style="background-color: #008000; color: #fff" on:click={createNetworkObject}>Add</button>
      </div>
    </div>
  </div>
</div>

<div
  class="modal fade"
  id="editNO"
  tabindex="-1"
  role="dialog"
  aria-labelledby="formEditNetworkObject"
  aria-hidden="true"
>
<div class="modal-dialog modal-dialog-centered" role="document">
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title" id="editNetworkObject">Edit Network-Object</h5>
      <button
        type="button"
        class="close"
        data-dismiss="modal"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <form class="mb-5">
        <div class="row mb-3">
          <div class="col">
            <label class="form-label" for="id">Id</label>
            <input
              bind:value={noEdit.id}
              class="form-control"
              id="id"
              type="text"
              disabled
            />
          </div>
        </div>
        <div class="row mb-3">
          <div class="col">
            <label class="form-label" for="name">Name</label>
            <input
              bind:value={noEdit.name}
              class="form-control"
              id="name"
              type="text"
            />
          </div>
        </div>
        <div class="row mb-3">
          <div class="col">
            <label class="form-label" for="ip"
              >IP
            </label>
            <input
              bind:value={noEdit.ip}
              class="form-control"
              id="ip"
              type="text"
            />
          </div>
        </div>
        <div class="row mb-3">
          <div class="col">
            <label class="form-label" for="subnet"
              >Subnet
            </label>
            <input
              bind:value={noEdit.subnet}
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
              bind:value={noEdit.description}
              class="form-control"
              id="description"
              type="text"
            />
          </div>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-dismiss="modal"
        >Close</button
      >
      <button
        type="button"
        class="btn"
        style="background-color: #008000; color: #fff" data-dismiss="modal"
        on:click={editNo}>Edit</button
      >
    </div>
  </div>
</div>
</div>
