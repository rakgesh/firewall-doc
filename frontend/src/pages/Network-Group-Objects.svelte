<script>
  import axios from "axios";
  import { isAuthenticated, user, jwt_token } from "../store";

  const api_root = window.location.origin + "/api";
  //-----------------------------

  let networkGroupObjects = [];
  let networkGroupObject = {
    name: null,
    description: null,
    membersId: null,
  };

  let ngoEdit = {
    id: null,
    name: null,
    ip: null,
    membersId: [],
  };

  let selection = [];

  let ngoDelete = {
    id: null,
    name: null,
  };

  function getNetworkGroupObjects() {
    var config = {
      method: "get",
      url: api_root + "/service/findNo",
      headers: { Authorization: "Bearer " + $jwt_token },
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
    networkGroupObject.membersId = selection;
    selection = [];
    var config = {
      method: "post",
      url: api_root + "/network-group-object",
      headers: {
        Authorization: "Bearer " + $jwt_token,
        "Content-Type": "application/json",
      },
      data: networkGroupObject,
    };

    axios(config)
      .then(function (response) {
        getNetworkGroupObjects();
      })
      .catch(function (error) {
        alert("Could not create Network Group Object");
        console.log(error);
      });

    networkGroupObject = {
      name: null,
      description: null,
      membersId: null,
    };
  }

  //-----------------------------

  let networkObjects = [];

  function getNetworkObjects() {
    var config = {
      method: "get",
      url: api_root + "/network-object",
      headers: { Authorization: "Bearer " + $jwt_token },
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

  function getNgoToEdit(ngo) {
    ngoEdit.id = ngo.ngoId;
    ngoEdit.name = ngo.ngoName;
    ngoEdit.description = ngo.ngoDescription;
    ngoEdit.membersId = ngo.membersId;
    selection = ngoEdit.membersId;
  }

  function editNgo() {
    ngoEdit.membersId = selection;
    selection = [];
    var config = {
      method: "put",
      url: api_root + "/network-group-object",
      headers: {
        Authorization: "Bearer " + $jwt_token,
        "Content-Type": "application/json",
      },
      data: ngoEdit,
    };

    axios(config)
      .then(function (response) {
        getNetworkGroupObjects();
      })
      .catch(function (error) {
        alert("Could not edit Network Group Object");
        console.log(error);
      });
  }

  function getNgoToDelete(ngoD) {
    ngoDelete.id = ngoD.ngoId;
    ngoDelete.name = ngoD.ngoName;
  }

  function deleteNgo(id) {
    var config = {
      method: "delete",
      url: api_root + "/network-group-object/" + id,
      headers: { Authorization: "Bearer " + $jwt_token },
    };

    axios(config)
      .then(function (response) {
        getNetworkGroupObjects();
      })
      .catch(function (error) {
        alert("Could not delete Network Group Object");
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

    networkGroupObjects = networkGroupObjects.sort(sort);
  };

  // search
</script>

<div style="margin-left: -52px; margin-right: -52px;">
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <h3 style="margin-top: 15px; font-weight: bold;">
          Network Group Objects
        </h3>
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
            >Add Network-Group-Object</button
          >
        </div>
      {/if}
    </div>
  </div>
  <table class="table table-striped table-hover" id="allHostObjects">
    <thead>
      <tr>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <th scope="col"
          >Name <span on:click={sort("ngoName")}>
            <i class="fa fa-fw fa-sort" /></span
          ></th
        >
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <th scope="col">Members</th>
        <th scope="col">Description</th>
        <th scope="col" />
        <th scope="col" />
      </tr>
    </thead>
    <tbody>
      {#each networkGroupObjects as n1}
        <tr>
          <td>{n1.ngoName}</td>
          <td>
            {#each n1.members as member}
              <li class="list-group-item">{member.name}</li>
              <li class="list-group-item" style="font-style: italic;">
                {member.ip}{member.subnet}
              </li>
            {/each}
          </td>
          <td>{n1.ngoDescription}</td>
          {#if ($isAuthenticated && $user.user_roles && $user.user_roles.includes("admin")) || ($isAuthenticated && $user.user_roles && $user.user_roles.includes("helpdesk"))}
            <td
              ><button
                style="border: none; background: none;"
                data-toggle="modal"
                data-target="#editNGO"
                on:click={() => getNgoToEdit(n1)}
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
                data-target="#deleteNGO"
                on:click={() => getNgoToDelete(n1)}
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
        <h5 class="modal-title" id="crateHostObject">
          Add Network-Group-Object
        </h5>
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
                bind:value={networkGroupObject.name}
                class="form-control"
                id="name"
                type="text"
                placeholder="NG_<ZONE>_<NETZWERK-ART>"
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
              <label class="form-label" for="membersId">Members</label><br />
              <button
                type="button"
                class="btn"
                style="background-color: none; color: #000; border-color: #D3D3D3; width: 466px; text-align: left;"
                data-toggle="collapse"
                data-target="#collapseExample"
                aria-expanded="false"
                aria-controls="collapseExample"
              >
                + Select Members
              </button>
              <div class="collapse" id="collapseExample">
                <div class="card card-body" style="border: 0;">
                  <div
                    class="list-group"
                    style="width: 466px; margin-left: -16px; margin-top: -17px;"
                  >
                    {#each networkObjects as n}
                      <label class="list-group-item">
                        <div class="form-check form-switch">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckDefault"
                            value={n.id}
                            bind:group={selection}
                          />
                          <label
                            class="form-check-label"
                            for="flexSwitchCheckDefault"
                            >{n.name} || {n.ip}{n.subnet}</label
                          >
                        </div>
                      </label>
                    {/each}
                  </div>
                </div>
              </div>
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
          on:click={createNetworkGroupObject}>Add</button
        >
      </div>
    </div>
  </div>
</div>

<div
  class="modal fade"
  id="editNGO"
  tabindex="-1"
  role="dialog"
  aria-labelledby="formEditNetworkGroupObject"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="editNetworkGroupObject">
          Edit Network-Group-Object
        </h5>
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
                bind:value={ngoEdit.id}
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
                bind:value={ngoEdit.name}
                class="form-control"
                id="name"
                type="text"
              />
            </div>
          </div>

          <div class="row mb-3">
            <div class="col">
              <label class="form-label" for="description">Description</label>
              <input
                bind:value={ngoEdit.description}
                class="form-control"
                id="description"
                type="text"
              />

              <div class="row mb-3">
                <div class="col">
                  <label class="form-label" for="membersId">Members</label><br
                  />
                  <button
                    type="button"
                    class="btn"
                    style="background-color: none; color: #000; border-color: #D3D3D3; width: 466px; text-align: left;"
                    data-toggle="collapse"
                    data-target="#edit"
                    aria-expanded="false"
                    aria-controls="edit"
                  >
                    + Edit Members
                  </button>
                  <div class="collapse" id="edit">
                    <div class="card card-body" style="border: 0;">
                      <div
                        class="list-group"
                        style="width: 466px; margin-left: -16px; margin-top: -17px;"
                      >
                        {#each networkObjects as n}
                          <label class="list-group-item">
                            <div class="form-check form-switch">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="flexSwitchCheckDefault"
                                value={n.id}
                                bind:group={selection}
                              />
                              <label
                                class="form-check-label"
                                for="flexSwitchCheckDefault"
                                >{n.name} || {n.ip}{n.subnet}</label
                              >
                            </div>
                          </label>
                        {/each}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
          on:click={editNgo}>Edit</button
        >
      </div>
    </div>
  </div>
</div>

<div
  class="modal fade"
  id="deleteNGO"
  tabindex="-1"
  role="dialog"
  aria-labelledby="formDeleteNGO"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="deleteNGO">Delete Network-Group-Object</h5>
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
        Are you sure, that you want to delete this network group object <strong
          >"{ngoDelete.name}"</strong
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
          on:click={deleteNgo(ngoDelete.id)}>Delete</button
        >
      </div>
    </div>
  </div>
</div>
