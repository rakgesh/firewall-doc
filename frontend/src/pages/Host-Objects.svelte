<script>
  import axios from "axios";
  import { isAuthenticated, user, jwt_token } from "../store";

  const api_root = window.location.origin + "/api";

  let hostObjects = [];
  let hostObject = {
    name: null,
    ip: null,
    description: null,
  };

  let visibleData;
  let searchText;

  let hoEdit = {
    id: null,
    name: null,
    ip: null,
    description: null,
  };

  let hoDelete = {
    id: null,
    name: null,
  };

  function getHostObjects() {
    var config = {
      method: "get",
      url: api_root + "/host-object",
      headers: { Authorization: "Bearer " + $jwt_token },
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

  $: {
    visibleData = searchText
      ? hostObjects.filter((e) => {
          return (
            e.name.toLowerCase().match(`${searchText.toLowerCase()}.*`) ||
            e.ip.match(`${searchText}.*`) ||
            e.description.toLowerCase().match(`${searchText.toLowerCase()}.*`)
          );
        })
      : hostObjects;
  }

  function createHostObject() {
    var config = {
      method: "post",
      url: api_root + "/host-object",
      headers: {
        Authorization: "Bearer " + $jwt_token,
        "Content-Type": "application/json",
      },
      data: hostObject,
    };

    axios(config)
      .then(function (response) {
        getHostObjects();
      })
      .catch(function (error) {
        alert("Could not create Host Object");
        console.log(error);
      });

    hostObject = {
      name: null,
      ip: null,
      description: null,
    };
  }

  function getHoToEdit(ho) {
    hoEdit.id = ho.id;
    hoEdit.name = ho.name;
    hoEdit.ip = ho.ip;
    hoEdit.description = ho.description;
  }

  function editHo() {
    var config = {
      method: "put",
      url: api_root + "/host-object",
      headers: {
        Authorization: "Bearer " + $jwt_token,
        "Content-Type": "application/json",
      },
      data: hoEdit,
    };

    axios(config)
      .then(function (response) {
        getHostObjects();
      })
      .catch(function (error) {
        alert("Could not edit Host Object");
        console.log(error);
      });
  }

  function getHoToDelete(hoD) {
    hoDelete.id = hoD.id;
    hoDelete.name = hoD.name;
  }

  function deleteHo(id) {
    var config = {
      method: "delete",
      url: api_root + "/host-object/" + id,
      headers: { Authorization: "Bearer " + $jwt_token },
    };

    axios(config)
      .then(function (response) {
        getHostObjects();
      })
      .catch(function (error) {
        alert("Could not delete Host Object");
        console.log(error);
      });
  }

  let sortBy = { col: "name", ascending: true };

  $: sort = (column) => {
    if (sortBy.col == column) {
      sortBy.ascending = !sortBy.ascending;
    } else {
      sortBy.col = column;
      sortBy.ascending = true;
    }

    // Modifier to sorting function for ascending or descending
    let sortModifier = sortBy.ascending ? 1 : -1;

    let sort = (a, b) =>
      a[column] < b[column]
        ? -1 * sortModifier
        : a[column] > b[column]
        ? 1 * sortModifier
        : 0;

    hostObjects = hostObjects.sort(sort);
  };
</script>

<div style="margin-left: -52px; margin-right: -52px;">
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <h3 style="margin-top: 15px; font-weight: bold;">Host Objects</h3>
      </div>
      <div class="col" />
      {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes("admin")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes("helpdesk"))}
        <div class="col" style="text-align-last: right;">
          <button
            type="button"
            class="btn"
            data-toggle="modal"
            data-target="#crateHO"
            style="margin-top: 9px; background-color: #c73834; color: #fff"
            >Add Host-Object</button
          >
        </div>
      {/if}
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
      <div class="col" />
      <div class="col" />
      <div class="col" />
    </div>
  </div>
  <table class="table table-striped table-hover" id="allHostObjects">
    <thead>
      <tr>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <th scope="col"
          >Name <span on:click={sort("name")}>
            <i class="fa fa-fw fa-sort" /></span
          ></th
        >
        <th scope="col" on:click={sort("ip")}
          >IP <i class="fa fa-fw fa-sort" /></th
        >
        <th scope="col" on:click={sort("description")}
          >Description <i class="fa fa-fw fa-sort" /></th
        >
        <th scope="col" />
        <th scope="col" />
      </tr>
    </thead>
    {#if visibleData.length}
      <tbody>
        {#each visibleData as hostObject}
          <tr>
            <td>{hostObject.name}</td>
            <td>{hostObject.ip}</td>
            <td>{hostObject.description}</td>
            {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes("admin")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes("helpdesk"))}
              <td
                ><button
                  style="border: none; background: none;"
                  data-toggle="modal"
                  data-target="#editHO"
                  on:click={() => getHoToEdit(hostObject)}
                  ><i
                    class="fa fa-pencil-square-o fa-lg"
                    aria-hidden="true"
                  /></button
                ></td
              >
              <td
                ><button
                  style="border: none; background: none;"
                  data-toggle="modal"
                  data-target="#deleteHO"
                  on:click={() => getHoToDelete(hostObject)}
                >
                  <i class="fa fa-trash-o fa-lg" aria-hidden="true" /></button
                ></td
              >
            {:else}
              <td />
              <td />
            {/if}
          </tr>
        {/each}
      </tbody>
    {:else}
      <div>No data available</div>
    {/if}
  </table>
</div>

<div
  class="modal fade"
  id="crateHO"
  tabindex="-1"
  role="dialog"
  aria-labelledby="formCreateHostObject"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="crateHostObject">Add Host-Object</h5>
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
        <button type="button" class="btn btn-secondary" data-dismiss="modal"
          >Close</button
        >
        <button
          type="button"
          class="btn"
          data-dismiss="modal"
          style="background-color: #008000; color: #fff"
          on:click={createHostObject}>Add</button
        >
      </div>
    </div>
  </div>
</div>

<div
  class="modal fade"
  id="editHO"
  tabindex="-1"
  role="dialog"
  aria-labelledby="formEditHostObject"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="editHostObject">Edit Host-Object</h5>
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
                bind:value={hoEdit.id}
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
                bind:value={hoEdit.name}
                class="form-control"
                id="name"
                type="text"
              />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label class="form-label" for="ip">IP </label>
              <input
                bind:value={hoEdit.ip}
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
                bind:value={hoEdit.description}
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
          style="background-color: #008000; color: #fff"
          data-dismiss="modal"
          on:click={editHo}>Edit</button
        >
      </div>
    </div>
  </div>
</div>

<div
  class="modal fade"
  id="deleteHO"
  tabindex="-1"
  role="dialog"
  aria-labelledby="formDeleteHO"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="deleteHO">Delete Host-Object</h5>
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
        Are you sure, that you want to delete this host object <strong
          >"{hoDelete.name}"</strong
        >?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal"
          >Close</button
        >
        <button
          type="button"
          class="btn"
          data-dismiss="modal"
          style="background-color: #c73834; color: #fff"
          on:click={deleteHo(hoDelete.id)}>Delete</button
        >
      </div>
    </div>
  </div>
</div>
