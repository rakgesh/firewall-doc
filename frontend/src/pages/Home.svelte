<script>
  import axios from "axios";


  const api_root = "http://localhost:8080/api";

  let fwRulesByType = [];
  let fwRbyTypeZone = [];
  let zonenId = "63624cb4cad6de381d422c77";
  let perimId = "638b9d67ad3a355f6044babe";


  function getFirewallRulesByType() {
    var config = {
      method: "get",
      url: api_root + "/firewall-rule/byFwType",
      headers: {},
    };

    axios(config)
      .then(function (response) {
        fwRulesByType = response.data;
      })
      .catch(function (error) {
        alert("Could not get Firewall Rules by Type");
        console.log(error);
      });
  }
  getFirewallRulesByType();

$: {
  if (fwRulesByType.length) {
    getPie();
    console.log(fwRulesByType);
  }
}

  function getPie() {
  var width = 600, height= 500;
  var colors = d3.scaleOrdinal(d3.schemeDark2);
  var svg = d3.select("body").append("svg").attr("width", width).attr("height", height).style("background", "white");
  var details = fwRulesByType;
  var data = d3.pie().sort(null).value(function(d){return d.count;})
  (details);
  console.log(data);
  var segments = d3.arc().innerRadius(0).outerRadius(200).padAngle(.05).padRadius(50);
  var sections = svg.append("g").attr("transform", "translate(250, 250)").selectAll("path").data(data);
  sections.enter().append("path").attr("d", segments).attr("fill", function(d){return colors(d.data.count);});

  var content = d3.select("g").selectAll("text").data(data);
  content.enter().append("text").each(function(d)
  {
    var center = segments.centroid(d);
    d3.select(this).attr("x", center[0]).attr("y", center[1]).text(d.data.count);
  })
}

</script>



<div style="margin-left: -52px; margin-right: -52px;">



</div>

<style>

</style>