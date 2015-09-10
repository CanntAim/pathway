
// Globals
var selectedForQueryNodes = [];
var selectedForEditNodes = [];
var counts = {};
var str_info;


$(function () { // on dom ready

	function onChange(event) {
		var reader = new FileReader();
		reader.onload = onReaderLoad;
		reader.readAsText(event.target.files[0]);
	}

	function onReaderLoad(event) {
		console.log(event.target.result);
		var obj = JSON.parse(event.target.result);
		visual_pathway(obj);
	}

	function remove(event) {
		selectedForEditNodes.remove();
	}
/*	Color: "ff0033"
	GraphId: "b6fd7"
	Height: 27
	LabelSize: 10
	SUID: "b6fd7"
	Type: "Protein"
	Valign: "Middle"	
	Width: 80.75
	XrefDatasource: "Uniprot-TrEMBL"
	XrefId: "O15350"
	id: "b6fd7"
	name: "TP73alpha"
	selected: false
	shared_name: "TP73alpha"
*/
	function add(event) {
		var node = [];
		var edges = [];
		
		//parse table info
		var name = document.getElementById("name").value;
		var x = document.getElementById("data").rows.length;
		for(var i=1; i<x; i++){
			var edgeTypeId = "edge_type_n"+x;
			var nameNeigbhorId = "name_n"+x;
			
			var edgeType = document.getElementById(edgeTypeId).value;
			var nameNeighbor= document.getElementById(nameNeigbhorId).value;
			if(true){
				edges.push({ 
					group: "edges",
					data : {
        	   			id : "1",
             			SUID : "1",
            			LineThickness:1.0,
            			EndArrow:"Arrow",
            			Coords:[{"x":0,"y":0},{"x":0,"y":0}],
            			GraphId:"1",
            			ZOrder:"12288",
            			source:name,
            			target:nameNeighbor, 
            			StartArrow : "Line",
        				selected : false
      				},
      				selected : false
    			})
    		}
    	}
		
		node.push({ group: "nodes",
      			data: {
        			Color: "ff0033",
         			GraphId: name,
         			LabelSize: 10,
         			SUID: "b6fd7",
         			Type: "Protein",
         			Valign: "Middle",
         			Width: 80.75,
         			Height: 100,
         			id: name,
         			name: name,
         			selected: false,
         			shared_name: "Ivannode"
       			},
       			position: {
         			x: 500,
         			y: 500
      			}
   		})
   				
   		window.cy.add(node.concat(edges));
	}

	function visual_pathway(obj) {
		$('#cy').cytoscape({
			style: cytoscape.stylesheet()
			
				// node elements default css (unselected state)
				.selector('node').css({
					'content': 'data(name)',
					'text-valign': 'center',
					'color': 'black',
					'padding-left': 2,
					'padding-right': 2,
					'font-family': 'data(LabelSize)',
					'background-color': 'white'
				})
				.selector('node[Type="GeneProduct"]').css({
					'shape': 'rectangle',
					'width': 'data(Width)',
					'height': 'data(Height)',
					'text-valign': 'middle',
					'background-color': 'white',
					'border-color': 'black',
					'border-width': 1
				})
				.selector('node[Type="Protein"]').css({
					'shape': 'rectangle',
					'width': 'data(Width)',
					'height': 'data(Height)',
					'background-color': 'white',
					'color': '#ff3333',
					'border-color': '#ff3333',
					'border-style': 'solid',
					'border-width': 1
				})
				.selector('node[Shape="Brace"]').css({
					'shape': 'rectangle',
					'width': '1',
					'height': 'data(Width)',
					'background-color': 'black',
					'color': 'black',
					'border-color': 'black',
					'border-style': 'solid',
					'border-width': 1
				})
				.selector('node[FillColor="ffffff"]').css({
					'background-color': 'white',
					'color': 'blue',
					'text-halign': 'center',
					'text-valign': 'top'
				})
				
				// edge elements default css (unselected)
				.selector('edge').css({
					'line-color': 'black',
					'line-style': 'solid',
					'width': 1
				})
				.selector('edge[LineStyle="Dashed"]').css({
					'line-style': 'dashed',
					'line-color': 'black',
					'background-color': 'black',
					'color': 'black'
				})
				.selector('edge[EndArrow="Arrow"]').css({
					'target-arrow-shape': 'triangle',
					'target-arrow-color': 'black',
					'target-arrow-fill': 'filled'
				})
				.selector('edge[EndArrow="TBar"]').css({
					'target-arrow-shape': 'tee',
					'target-arrow-color': 'black',
					'target-arrow-fill': 'filled'
				})
				.selector('edge[ConnectorType="Elbow"]').css({
					'line-color': 'yellow',
					'line-style': 'solid'
				})
				
				// node & edge elements (selected state)
				.selector('edge:selected').css({
					'background-color': 'black',
					'line-color': 'black',
					'target-arrow-color': 'black',
					'source-arrow-color': 'black'
				})
				.selector('node:selected').css({
					'background-color': 'yellow'
				})
				
				// misc
				.selector('.faded').css({
					'opacity': 1,
					'text-opacity': 0
				})
				.selector('.green').css({
					'background-color': 'green',
					'color': 'black'
				})
				.selector('.red').css({
					'background-color': 'red',
					'color': 'white'
				}),

			elements: obj.elements,

			layout: {
				name: 'preset',
				padding: 10
			},

			ready: function () {
				window.cy = this;
				var selectedNodes = [];
		
				// custom event handlers
				cy.off('click', 'node').on('click', 'node', function (e) {

					e.preventDefault();

					var node = this;

					var node_name = node.data("shared_name");
					selectedNodes.push(node_name);
					var node_id = node.data("id");
					var count = selectedNodes.filter(function (value) {
						return value === node_name;
					}).length;

					selectedForQueryNodes.push(node_name);
					if (count % 2 == 0) {
						node.removeClass('green');
						node.addClass('red');
					} else {
						node.removeClass('red');
						node.addClass('green');
					}

				});
				
				cy.on('select', 'node', function(event){
			    	selectedForEditNodes = cy.$('node:selected');
				});
			},

  			// initial viewport state:
  			zoom: 1,
  			pan: { x: 0, y: 0 },
			
			// interaction options:
  			minZoom: 1e-50,
  			maxZoom: 1e50,
  			zoomingEnabled: true,
  			userZoomingEnabled: true,
  			panningEnabled: true,
  			userPanningEnabled: true,
 	 		boxSelectionEnabled: true,
  			selectionType: 'single',
  			touchTapThreshold: 8,
  			desktopTapThreshold: 4,
  			autolock: false,
  			autoungrabify: false,
  			autounselectify: false,

  			// rendering options:
  			headless: false,
  			styleEnabled: true,
  			hideEdgesOnViewport: false,
  			hideLabelsOnViewport: false,
  			textureOnViewport: false,
  			motionBlur: false,
  			motionBlurOpacity: 0.2,
  			wheelSensitivity: 1,
  			pixelRatio: 1,
  			initrender: function(evt){ /* ... */ },
  			renderer: { /* ... */ }
		});	
	}

	document.getElementById('file').addEventListener('change', onChange);
	document.getElementById('delete').addEventListener('click', remove);
	document.getElementById('add').addEventListener('click', add);
}); // on dom ready
