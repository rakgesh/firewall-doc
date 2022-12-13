<script>
  import axios from "axios";

  const api_root = "http://localhost:8080/api";

  let fwRulesByType = [];

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
    }
  }


  function getPie() {
    var width = 400,
      height = 500;
    var colors = d3.scaleOrdinal(d3.schemeDark2);
    var svg = d3
      .select("#piechart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("background", "white");
    var details = fwRulesByType;
    var data = d3
      .pie()
      .sort(null)
      .value(function (d) {
        return d.count;
      })(details);
    console.log(data);
    var segments = d3
      .arc()
      .innerRadius(0)
      .outerRadius(200)
      .padRadius(50);
    var sections = svg
      .append("g")
      .attr("transform", "translate(200, 200)")
      .selectAll("path")
      .data(data);
    sections
      .enter()
      .append("path")
      .attr("d", segments)
      .attr("fill", function (d) {
        return colors(d.data.count);
      });

    var content = d3.select("g").selectAll("text").data(data);
    content
      .enter()
      .append("text").classed("inside", true)
      .each(function (d) {
        var center = segments.centroid(d);
        d3.select(this)
          .attr("x", center[0])
          .attr("y", center[1])
          .text(d.data.count);
      });

    var legends = svg
      .append("g")
      .attr("transform", "translate(125, 385)")
      .selectAll(".legends")
      .data(data);

    var legend = legends
      .enter()
      .append("g")
      .classed("legends", true)
      .attr("transform", function (d, i) {
        return "translate(0," + (i + 1) * 30 + ")";
      });
    legend
      .append("rect")
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", function (d) {
        return colors(d.data.count);
      });
    legend
      .append("text")
      .text(function (d) {
        return d.data.name;
      })
      .attr("fill", function (d) {
        return colors(d.data.count);
      })
      .attr("x", 30)
      .attr("y", 20);
  }

</script>
<svg id="piechart" style="height: 500px; width: 400px;"></svg>
