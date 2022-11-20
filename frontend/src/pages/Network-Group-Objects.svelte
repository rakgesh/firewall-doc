<script>
  import axios from "axios";



 
  const api_root = "http://localhost:8080";
//-----------------------------

  let networkGroupObjects = [];
  let networkGroupObject = {
    name: null,
    description: null,
    membersId: null,
  };

  function getNetworkGroupObjects() {
    var config = {
      method: "get",
      url: api_root + "/api/service/findNo",
      headers: {},
    };

    axios(config)
      .then(function (response) {
        networkGroupObjects = response.data;
      })
      .catch(function (error) {
        alert("Could not get Network Group Objects");
        console.log(error);
      });
  }
  getNetworkGroupObjects();

//-----------------------------

function createNetworkGroupObject() {
    var config = {
      method: "post",
      url: api_root + "/network-group-object",
      headers: {
        "Content-Type": "application/json",
      },
      data: networkGroupObject,
    };

    axios(config)
      .then(function (response) {
        alert("Network Group Object created");
        getNetworkGroupObjects();
      })
      .catch(function (error) {
        alert("Could not create Network Group Object");
        console.log(error);
      });
  }

//-----------------------------

let networkObjects = [];
  
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

//-----------------------------

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
		
      networkGroupObjects = networkGroupObjects.sort(sort);
	}

// search

</script>

<div class="container-fluid">
  <div class="row">
    <div class="col">
      <h3 style="margin-top: 15px; font-weight: bold;">All Network Group Objects</h3>
    </div>
    <div class="col" />
    <div class="col" style="text-align-last: right;">
      <button
        type="button"
        class="btn"
        data-toggle="modal" data-target="#crateHO"
        style="margin-top: 9px; background-color: #c73834; color: #fff"
        >Add Network-Group-Object</button
      >
    </div>
  </div>
</div>
<table class="table table-striped table-hover" id="allHostObjects">
  <thead>
    <tr>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <th scope="col">Name <span on:click={sort("ngoName")}> <i class="fa fa-fw fa-sort"></i></span></th>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <th scope="col">Members</th>
      <th scope="col" >Description</th>
      <th scope="col" ></th>
      <th scope="col"></th>
    </tr>
  </thead>
  <tbody>
    {#each networkGroupObjects as n1}
      <tr>
        <td>{n1.ngoName}</td>
        <td>
        {#each n1.members as member}
        <li class="list-group-item">{member.name}</li>
        <li class="list-group-item" style="font-style: italic;">{member.ip}</li>  
        {/each}
        </td>
        <td>{n1.ngoDescription}</td>
        <td>edit</td>
        <td>delete</td>
      </tr>
      {/each}
  </tbody>
</table>
<p> Bearbeiten | Löschen </p>

<div class="modal fade" id="crateHO" tabindex="-1" role="dialog" aria-labelledby="formCreateHostObject" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="crateHostObject">Add Host-Group-Object</h5>
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
                bind:value={networkGroupObject.name}
                class="form-control"
                id="name"
                type="text"
                placeholder="HG_<ZONE>_<HOST-ART>"
              />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label class="form-label" for="description">Description</label>
              <input
                bind:value={networkGroupObject.description}
                class="form-control"
                id="description"
                type="text"
              />
            </div>
          </div>
          
            <div class="row mb-3">
            <div class="col">
               
              <label class="form-label" for="membersId">Members</label>
            <select id="membersId"  type="text" class="form-control">
              {#each networkObjects as n}
                
              
              <option value="{n.id}">{n.name}</option>
              {/each}
            </select>
              
            </div>
            
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn" style="background-color: #008000; color: #fff" on:click={createNetworkGroupObject}>Add</button>
      </div>
    </div>
  </div>
</div>

<!--------------->
