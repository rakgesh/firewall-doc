<script>
  import axios from "axios";
  import {jwt_token} from "../store";

  const api_root = "http://localhost:8080/api";

  let serviceGroupObjects = [];
  let serviceGroupObject = {
    name: null,
    port: [],
    description: null,
  };

  let sgoEdit = {
    id: null,
    name: null,
    port: [],
    description: null,
  };

  let portBeforeEdit = [];

  let sgoDelete = {
    id: null,
    name: null,
  }

  function getServiceGroupObjects() {
    var config = {
      method: "get",
      url: api_root + "/service-group-object",
      headers: {Authorization: "Bearer "+$jwt_token},
    };

    axios(config)
      .then(function (response) {
        serviceGroupObjects = response.data;
      })
      .catch(function (error) {
        alert("Could not get Service Group Objects");
        console.log(error);
      });
  }
  getServiceGroupObjects();

  function createServiceGroupObject() {
    var port = serviceGroupObject.port.split(", ");
    serviceGroupObject.port = port;
    var config = {
      method: "post",
      url: api_root + "/service-group-object",
      headers: {Authorization: "Bearer "+$jwt_token,
        "Content-Type": "application/json",
      },
      data: serviceGroupObject,
    };

    axios(config)
      .then(function (response) {
        getServiceGroupObjects();
      })
      .catch(function (error) {
        alert("Could not create Service Group Objects");
        console.log(error);
      });
  }

  function getSgoToEdit(sgoE) {
    sgoEdit.id = sgoE.id;
    sgoEdit.name = sgoE.name;
    sgoEdit.port = sgoE.port;
    portBeforeEdit = sgoE.port;
    sgoEdit.description = sgoE.description;
  }

  function editSGO() {
    if (sgoEdit.port != portBeforeEdit) {
      var port = sgoEdit.port.split(",");
      sgoEdit.port = port;
    }
    var config = {
      method: "put",
      url: api_root + "/service-group-object",
      headers: {Authorization: "Bearer "+$jwt_token,
        "Content-Type": "application/json",
      },
      data: sgoEdit,
    };

    axios(config)
      .then(function (response) {
        getServiceGroupObjects();
      })
      .catch(function (error) {
        alert("Could not edit Service Group Object");
        console.log(error);
      });
  }

  function getSgoToDelete(sgoD) {
    sgoDelete.id = sgoD.id;
    sgoDelete.name = sgoD.name;
  }

  function deleteSgo(id) {
    var config = {
      method: "delete",
      url: api_root + "/service-group-object/" + id,
      headers: {Authorization: "Bearer "+$jwt_token},
    };

    axios(config)
      .then(function (response) {
        getServiceGroupObjects();
      })
      .catch(function (error) {
        alert("Could not delete Service Group Object");
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

    serviceGroupObjects = serviceGroupObjects.sort(sort);
  };
</script>

<div style="margin-left: -52px; margin-right: -52px;">
<div class="container-fluid">
  <div class="row">
    <div class="col">
      <h3 style="margin-top: 15px; font-weight: bold;">
        Service Group Objects
      </h3>
    </div>
    <div class="col" />
    <div class="col" style="text-align-last: right;">
      <button
        type="button"
        class="btn"
        data-toggle="modal"
        data-target="#createSGO"
        style="margin-top: 9px; background-color: #c73834; color: #fff"
        >Add Service Group Objects</button
      >
    </div>
  </div>
</div>
<table class="table table-striped table-hover" id="allSGO">
  <thead>
    <tr>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <th scope="col"
        >Name <span on:click={sort("name")}>
          <i class="fa fa-fw fa-sort" /></span
        ></th
      >
      <th scope="col">Ports</th>
      <th scope="col">Description </th>
      <th scope="col" />
      <th scope="col" />
    </tr>
  </thead>
  <tbody>
    {#each serviceGroupObjects as serviceGroupObject}
      <tr>
        <td>{serviceGroupObject.name}</td>
        <td>
          {#each serviceGroupObject.port as port}
            <li class="list-group-item">{port}</li>
          {/each}
        </td>
        <td>{serviceGroupObject.description}</td>
        <td
          ><button
            style="border: none; background: none;"
            data-toggle="modal"
            data-target="#editSGO"
            on:click={() => getSgoToEdit(serviceGroupObject)}
            ><i
              class="fa fa-pencil-square-o fa-lg"
              aria-hidden="true"
            /></button
          ></td
        >
        <td><button
          style="border: none; background: none;"
          data-toggle="modal"
          data-target="#deleteSGO"
          on:click={() => getSgoToDelete(serviceGroupObject)}
          >
          <i class="fa fa-trash-o fa-lg" aria-hidden="true" /></td>
      </tr>
    {/each}
  </tbody>
</table>
</div>

<div
  class="modal fade"
  id="createSGO"
  tabindex="-1"
  role="dialog"
  aria-labelledby="formCreateSGO"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="createSGO">Add Service-Group-Object</h5>
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
                bind:value={serviceGroupObject.name}
                class="form-control"
                id="name"
                type="text"
              />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label class="form-label" for="description">Ports</label>
              <input
                bind:value={serviceGroupObject.port}
                class="form-control"
                id="tag"
                type="text"
              />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label class="form-label" for="description">Description</label>
              <input
                bind:value={serviceGroupObject.description}
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
          on:click={createServiceGroupObject}
          data-dismiss="modal">Add</button
        >
      </div>
    </div>
  </div>
</div>

<div
  class="modal fade"
  id="editSGO"
  tabindex="-1"
  role="dialog"
  aria-labelledby="formEditSGO"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="editSGO">Edit service-Group-Object</h5>
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
                bind:value={sgoEdit.id}
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
                bind:value={sgoEdit.name}
                class="form-control"
                id="name"
                type="text"
              />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label class="form-label" for="port">Ports </label>
              <input
                bind:value={sgoEdit.port}
                class="form-control"
                id="tags"
                type="text"
              />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label class="form-label" for="description">Description</label>
              <input
                bind:value={sgoEdit.description}
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
          on:click={editSGO}>Edit</button
        >
      </div>
    </div>
  </div>
</div>


<div
  class="modal fade"
  id="deleteSGO"
  tabindex="-1"
  role="dialog"
  aria-labelledby="formDeleteSGO"
  aria-hidden="true"
>
<div class="modal-dialog modal-dialog-centered" role="document">
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title" id="deleteSGO">Delete Service-Group-Object</h5>
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
      Are you sure, that you want to delete this service group object <strong>"{sgoDelete.name}"</strong>?
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
        on:click={deleteSgo(sgoDelete.id)}>Delete</button
      >
    </div>
  </div>
</div>
</div>