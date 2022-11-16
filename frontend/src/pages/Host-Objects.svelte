<script>
    import axios from "axios";

    // TODO: Setze hier die URL zu deinem mit Postman erstellten Mock Server
    const api_root = "http://localhost:8080";

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
</script>


<h1 class="mt-3">Create Host Object</h1>
<form class="mb-5">
    <div class="row mb-3">
        <div class="col">
            <label class="form-label" for="name">Name</label>
            <input
                bind:value={hostObject.name}
                class="form-control"
                id="name"
                type="text"
            />
        </div>
    </div>
    <div class="row mb-3">
        <div class="col">
            <label class="form-label" for="ip">IP</label>
            <input
                bind:value={hostObject.ip}
                class="form-select"
                id="ip"
                type="text"
            />
        </div>
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
    <button type="button" class="btn btn-primary" on:click={createHostObject}>Submit</button>
</form>

<h1>All Host Objects</h1>
<table class="table">
    <thead>
        <tr>
            <th scope="col">Name</th>
            <th scope="col">IP</th>
            <th scope="col">Description</th>
        </tr>
    </thead>
    <tbody>
        {#each hostObjects as hostObject}
            <tr>
                <td>{hostObject.name}</td>
                <td>{hostObject.ip}</td>
                <td>{hostObject.description}</td>
            </tr>
        {/each}
    </tbody>
</table>
