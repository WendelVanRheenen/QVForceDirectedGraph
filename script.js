function FDGInit(){
	//load scripts
	Qva.LoadScript(Qva.Remote + "?public=only&name=Extensions/ForceDirectedGraph/d3.v4.min.js", function() {});
	Qva.LoadScript(Qva.Remote + "?public=only&name=Extensions/ForceDirectedGraph/force-directed-graph.js", FDGDone);
	
	//load css file
	Qva.LoadCSS(Qva.Remote +"?public=only&name=Extensions/ForceDirectedGraph/style.css");	
}

function FDGDone(){
	$(document).ready(function() { 
	Qva.AddExtension('ForceDirectedGraph', function() { 
		// //add drawing area based on window size
		// if(!this.svgCreated)
		// {
			// var svgHtml = document.createElement("svg");
			// svgHtml.width = this.GetWidth();
			// svgHtml.height = this.GetHeight();
			// svgHtml.innerHTML = "asdfasd<br />";
			// this.Element.appendChild(svgHtml);
			// this.svgCreated = true;
		// }
		
		var offset = 10;
		this.Element.innerHTML = '<svg width="'+ (this.GetWidth() - offset)  + '" height="' + (this.GetHeight() - offset) + '"/>'; //add drawing area based on window size
		
		// for (var rowIx = 0; rowIx < this.Data.Rows.length; rowIx++) {
		   // var row = this.Data.Rows[rowIx];
		   // myDimensionFrom = row[0].text;
		   // myDimensionTo = row[1].text;
		   // myMeasureValue = row[2].text;
		   
		   // console.log(myDimensionFrom);
		   // console.log(myDimensionTo);
		   // console.log(myMeasureValue);
		// }
		
		FDGLoadData();
	});
	});
}

function FDGLoadData(var data) {
	var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

	var color = d3.scaleOrdinal(d3.schemeCategory20);

	var simulation = d3.forceSimulation()
		.force("link", d3.forceLink().id(function(d) { return d.id; }))
		.force("charge", d3.forceManyBody())
		.force("center", d3.forceCenter(width / 2, height / 2));

	d3.json(Qva.Remote +"?public=only&name=Extensions/ForceDirectedGraph/miserables.json", function(error, graph) {
	  if (error) throw error;

	  var link = svg.append("g")
		  .attr("class", "links")
		.selectAll("line")
		.data(graph.links)
		.enter().append("line")
		  .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

	  var node = svg.append("g")
		  .attr("class", "nodes")
		.selectAll("circle")
		.data(graph.nodes)
		.enter().append("circle")
		  .attr("r", 5)
		  .attr("fill", function(d) { return color(d.group); })
		  .call(d3.drag()
			  .on("start", dragstarted)
			  .on("drag", dragged)
			  .on("end", dragended));

	  node.append("title")
		  .text(function(d) { return d.id; });

	  simulation
		  .nodes(graph.nodes)
		  .on("tick", ticked);

	  simulation.force("link")
		  .links(graph.links);

	  function ticked() {
		link
			.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });

		node
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; });
	  }
	});
	console.log("Hellow");
}

FDGInit();
