<script>
  import axios from "axios";
  import { isAuthenticated, user, jwt_token } from "../store";

  // TODO: Setze hier die URL zu deinem mit Postman erstellten Mock Server
  const api_root = "http://localhost:8080/api";

  let useCases = [];
  let useCase = {
    name: null,
    description: null,
    tags: [],
  };

  let useCaseEdit = {
    id: null,
    name: null,
    description: null,
    tags: [],
  };

  let useCaseDelete = {
    id: null,
    name: null,
  };

  let tagsBeforeEdit = [];

  function getUseCases() {
    var config = {
      method: "get",
      url: api_root + "/use-case",
      headers: {},
    };

    axios(config)
      .then(function (response) {
        useCases = response.data;
      })
      .catch(function (error) {
        alert("Could not get Use Cases");
        console.log(error);
      });
  }
  getUseCases();

  function createUseCase() {
    var tags = useCase.tags.split(", ");
    useCase.tags = tags;
    var config = {
      method: "post",
      url: api_root + "/use-case",
      headers: {
        Authorization: "Bearer " + $jwt_token,
        "Content-Type": "application/json",
      },
      data: useCase,
    };

    axios(config)
      .then(function (response) {
        getUseCases();
      })
      .catch(function (error) {
        alert("Could not create Use Case");
        console.log(error);
      });
  }

  function getUseCaseToEdit(ucE) {
    useCaseEdit.id = ucE.id;
    useCaseEdit.name = ucE.name;
    useCaseEdit.description = ucE.description;
    useCaseEdit.tags = ucE.tags;
    tagsBeforeEdit = ucE.tags;
  }

  function editUseCase() {
    if (useCaseEdit.tags != tagsBeforeEdit) {
      var tags = useCaseEdit.tags.split(",");
      useCaseEdit.tags = tags;
    }
    var config = {
      method: "put",
      url: api_root + "/use-case",
      headers: {
        Authorization: "Bearer " + $jwt_token,
        "Content-Type": "application/json",
      },
      data: useCaseEdit,
    };

    axios(config)
      .then(function (response) {
        getUseCases();
      })
      .catch(function (error) {
        alert("Could not edit Use Case");
        console.log(error);
      });
  }

  function getUseCaseToDelete(ucD) {
    useCaseDelete.id = ucD.id;
    useCaseDelete.name = ucD.name;
  }

  function deleteUseCase(id) {
    var config = {
      method: "delete",
      url: api_root + "/use-case/" + id,
      headers: { Authorization: "Bearer " + $jwt_token },
    };

    axios(config)
      .then(function (response) {
        getUseCases();
      })
      .catch(function (error) {
        alert("Could not delete Use Case");
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

    useCases = useCases.sort(sort);
  };
</script>

<div style="margin-left: -52px; margin-right: -52px;">
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <h3 style="margin-top: 15px; font-weight: bold;">Use Cases</h3>
      </div>
      <div class="col" />
      {#if $isAuthenticated}
        <div class="col" style="text-align-last: right;">
          <button
            type="button"
            class="btn"
            data-toggle="modal"
            data-target="#crateUC"
            style="margin-top: 9px; background-color: #c73834; color: #fff"
            >Add Use Case</button
          >
        </div>
      {/if}
    </div>
  </div>
  <table class="table table-striped table-hover" id="allUseCases">
    <thead>
      <tr>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <th scope="col"
          >Name <span on:click={sort("name")}>
            <i class="fa fa-fw fa-sort" /></span
          ></th
        >
        <th scope="col">Description </th>
        <th scope="col">Tags (Standort/Bereich)</th>
        {#if $isAuthenticated}
          <th scope="col" />
          <th scope="col" />
        {/if}
      </tr>
    </thead>
    <tbody>
      {#each useCases as useCase}
        <tr>
          <td>{useCase.name}</td>
          <td>{useCase.description}</td>
          <td
            >{#each useCase.tags as tags}
              {tags};
            {/each}</td
          >
          {#if $isAuthenticated}
            <td
              ><button
                style="border: none; background: none;"
                data-toggle="modal"
                data-target="#editUC"
                on:click={() => getUseCaseToEdit(useCase)}
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
                data-target="#deleteUC"
                on:click={() => getUseCaseToDelete(useCase)}
              >
                <i class="fa fa-trash-o fa-lg" aria-hidden="true" /></button
              ></td
            >
          {/if}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<div
  class="modal fade"
  id="crateUC"
  tabindex="-1"
  role="dialog"
  aria-labelledby="formCreateUseCase"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="crateUseCase">Add Use-Case</h5>
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
                bind:value={useCase.name}
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
                bind:value={useCase.description}
                class="form-control"
                id="description"
                type="text"
              />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label class="form-label" for="description"
                >Tags (Standort/Organisation)
              </label>
              <input
                bind:value={useCase.tags}
                class="form-control"
                id="tag"
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
          on:click={createUseCase}>Add</button
        >
      </div>
    </div>
  </div>
</div>

<div
  class="modal fade"
  id="editUC"
  tabindex="-1"
  role="dialog"
  aria-labelledby="formEditUseCase"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="editUseCase">Edit Use-Case</h5>
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
                bind:value={useCaseEdit.id}
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
                bind:value={useCaseEdit.name}
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
                bind:value={useCaseEdit.description}
                class="form-control"
                id="description"
                type="text"
              />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col">
              <label class="form-label" for="tags"
                >Tags (Standort/Organisation)
              </label>
              <input
                bind:value={useCaseEdit.tags}
                class="form-control"
                id="tags"
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
          on:click={editUseCase}>Edit</button
        >
      </div>
    </div>
  </div>
</div>

<div
  class="modal fade"
  id="deleteUC"
  tabindex="-1"
  role="dialog"
  aria-labelledby="formDeleteUseCase"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="deleteUseCase">Delete Use-Case</h5>
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
        Are you sure, that you want to delete this use case <strong
          >"{useCaseDelete.name}"</strong
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
          on:click={deleteUseCase(useCaseDelete.id)}>Delete</button
        >
      </div>
    </div>
  </div>
</div>
