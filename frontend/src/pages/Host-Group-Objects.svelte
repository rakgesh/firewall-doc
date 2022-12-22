<script>
  import axios from "axios";
  import { jwt_token } from "../store";

  const api_root = window.location.origin + "/api";
  //-----------------------------

  let hostGroupObjects = [];
  let hostGroupObject = {
    name: null,
    description: null,
    membersId: null,
  };

  let hgoEdit = {
    id: null,
    name: null,
    ip: null,
    membersId: [],
  };

  let selection = [];

  let hgoDelete = {
    id: null,
    name: null,
  };

  function getHostGroupObjects() {
    var config = {
      method: "get",
      url: api_root + "/service/findHo",
      headers: { Authorization: "Bearer " + $jwt_token },
    };

    axios(config)
      .then(function (response) {
        hostGroupObjects = response.data;
      })
      .catch(function (error) {
        alert("Could not get Host Group Objects");
        console.log(error);
      });
  }
  getHostGroupObjects();

  //-----------------------------

  function createHostGroupObject() {
    hostGroupObject.membersId = selection;
    selection = [];
    var config = {
      method: "post",
      url: api_root + "/host-group-object",
      headers: {
        Authorization: "Bearer " + $jwt_token,
        "Content-Type": "application/json",
      },
      data: hostGroupObject,
    };

    axios(config)
      .then(function (response) {
        getHostGroupObjects();
      })
      .catch(function (error) {
        alert("Could not create Host Group Object");
        console.log(error);
      });

    hostGroupObject = {
      name: null,
      description: null,
      membersId: null,
    };
  }

  //-----------------------------

  let hostObjects = [];

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

  //-----------------------------

  function getHgoToEdit(hgo) {
    hgoEdit.id = hgo.hgoId;
    hgoEdit.name = hgo.hgoName;
    hgoEdit.description = hgo.hgoDescription;
    hgoEdit.membersId = hgo.membersId;
    selection = hgoEdit.membersId;
  }

  function editHgo() {
    hgoEdit.membersId = selection;
    selection = [];
    var config = {
      method: "put",
      url: api_root + "/host-group-object",
      headers: {
        Authorization: "Bearer " + $jwt_token,
        "Content-Type": "application/json",
      },
      data: hgoEdit,
    };

    axios(config)
      .then(function (response) {
        getHostGroupObjects();
      })
      .catch(function (error) {
        alert("Could not edit Host Group Object");
        console.log(error);
      });
  }

  function getHgoToDelete(hgoD) {
    hgoDelete.id = hgoD.hgoId;
    hgoDelete.name = hgoD.hgoName;
  }

  function deleteHgo(id) {
    var config = {
      method: "delete",
      url: api_root + "/host-group-object/" + id,
      headers: { Authorization: "Bearer " + $jwt_token },
    };

    axios(config)
      .then(function (response) {
        getHostGroupObjects();
      })
      .catch(function (error) {
        alert("Could not delete Host Group Object");
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

    hostGroupObjects = hostGroupObjects.sort(sort);
  };

  // search
</script>

<div style="margin-left: -52px; margin-right: -52px;">
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <h3 style="margin-top: 15px; font-weight: bold;">Host Group Objects</h3>
      </div>
      <div class="col" />
      <div class="col" style="text-align-last: right;">
        <button
          type="button"
          class="btn"
          data-toggle="modal"
          data-target="#crateHO"
          style="margin-top: 9px; background-color: #c73834; color: #fff"
          >Add Host-Group-Object</button
        >
      </div>
    </div>
  </div>
  <table class="table table-striped table-hover" id="allHostObjects">
    <thead>
      <tr>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <th scope="col"
          >Name <span on:click={sort("hgoName")}>
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
      {#each hostGroupObjects as h1}
        <tr>
          <td>{h1.hgoName} </td><td>
            {#each h1.members as member}
              <li class="list-group-item">{member.name}</li>
              <li class="list-group-item" style="font-style: italic;">
                {member.ip}
              </li>
            {/each}
          </td>
          <td>{h1.hgoDescription}</td>
          <td
            ><button
              style="border: none; background: none;"
              data-toggle="modal"
              data-target="#editHGO"
              on:click={() => getHgoToEdit(h1)}
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
              data-target="#deleteHGO"
              on:click={() => getHgoToDelete(h1)}
            >
              <i class="fa fa-trash-o fa-lg" aria-hidden="true" /></button
            ></td
          >
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
        <h5 class="modal-title" id="crateHostObject">Add Host-Group-Object</h5>
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
                bind:value={hostGroupObject.name}
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
                bind:value={hostGroupObject.description}
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
                    {#each hostObjects as h}
                      <label class="list-group-item">
                        <div class="form-check form-switch">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckDefault"
                            value={h.id}
                            bind:group={selection}
                          />
                          <label
                            class="form-check-label"
                            for="flexSwitchCheckDefault"
                            >{h.name} || {h.ip}</label
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
          on:click={createHostGroupObject}>Add</button
        >
      </div>
    </div>
  </div>
</div>

<div
  class="modal fade"
  id="editHGO"
  tabindex="-1"
  role="dialog"
  aria-labelledby="formEditHostGroupObject"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="editHostGroupObject">
          Edit Host-Group-Object
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
                bind:value={hgoEdit.id}
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
                bind:value={hgoEdit.name}
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
                bind:value={hgoEdit.description}
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
                        {#each hostObjects as h}
                          <label class="list-group-item">
                            <div class="form-check form-switch">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="flexSwitchCheckDefault"
                                value={h.id}
                                bind:group={selection}
                              />
                              <label
                                class="form-check-label"
                                for="flexSwitchCheckDefault"
                                >{h.name} || {h.ip}</label
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
          on:click={editHgo}>Edit</button
        >
      </div>
    </div>
  </div>
</div>

<div
  class="modal fade"
  id="deleteHGO"
  tabindex="-1"
  role="dialog"
  aria-labelledby="formDeleteHGO"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="deleteHGO">Delete Host-Group-Object</h5>
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
        Are you sure, that you want to delete this host group object <strong
          >"{hgoDelete.name}"</strong
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
          on:click={deleteHgo(hgoDelete.id)}>Delete</button
        >
      </div>
    </div>
  </div>
</div>
