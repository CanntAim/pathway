// Globals
var selectedForQueryNodes = [];
var selectedForEditNodes = [];
var bundleCounter = 0;
var edgeCounter = 0;
var loadCounts = 0;
var header ="";
var counts = {};
var str_info;

$(function () { // on dom ready

	function onChange(event) {
		var reader = new FileReader();
		reader.onload = onReaderLoad;
		reader.readAsText(event.target.files[0]);
	}

	function onReaderLoad(event) {
		var obj = JSON.parse(event.target.result);
		if(loadCounts==0){
			header = obj.data;
			visual_pathway(obj);
		} else {
			for(var i=0; i < obj.elements.nodes.length; i++){
				obj.elements.nodes[i].position.x = obj.elements.nodes[i].position.x+1000*loadCounts;
			}
			window.cy.add(obj.elements)
		}
		loadCounts++;
	}

	function remove(event) {
		selectedForEditNodes.remove();
	}

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
			if(edgeType == "incoming"){
				edges.push({ 
					group: "edges",
					data : {
        	   			id : "e"+edgeCounter,
             			SUID : "e"+edgeCounter,
            			LineThickness:1.0,
            			EndArrow:"Arrow",
            			Coords:[{"x":0,"y":0},{"x":0,"y":0}],
            			GraphId:"e"+edgeCounter,
            			ZOrder:"12288",
            			source:name,
            			target:nameNeighbor, 
            			StartArrow : "Line",
        				selected : false
      				},
      				selected : false
    			})
    		} else {
    			edges.push({ 
					group: "edges",
					data : {
        	   			id : "e"+edgeCounter,
             			SUID : "e"+edgeCounter,
            			LineThickness:1.0,
            			EndArrow:"Line",
            			Coords:[{"x":0,"y":0},{"x":0,"y":0}],
            			GraphId:"e"+edgeCounter,
            			ZOrder:"12288",
            			source:name,
            			target:nameNeighbor, 
            			StartArrow : "Arrow",
        				selected : false
      				},
      				selected : false
    			})
    		}
    		edgeCounter++;
    	}
		
		node.push({ group: "nodes",
      			data: {
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
         			shared_name: name
       			},
       			position: {
         			x: 500,
         			y: 500
      			},
      			css: { 
      				'border-color': 'black', 
      				'color': 'black'
      			} 
   		})
   				
   		window.cy.add(node.concat(edges));
	}
	
	function bundle(event){		
		var nodes = [];
		var edges =[];
		// Create new parent
		nodes.push({ group: "nodes",
      			data: {
         			GraphId: "n"+bundleCounter,
         			LabelSize: 10,
         			SUID: "b6fd7",
         			Type: "Protein",
         			Valign: "Middle",
         			Width: 80.75,
         			Height: 100,
         			id: "n"+bundleCounter,
         			name: "n"+bundleCounter,
         			selected: false,
         			shared_name: "n"+bundleCounter
       			},
       			position: {
         			x: 500,
         			y: 500
      			},
      			css: { 
      				"border-color": "red" 
      			} 
   		})

		// Create copies of old nodes
		for (var i=0; i < selectedForEditNodes.size(); i++) {
			if(typeof selectedForEditNodes[i].data('parent') == 'undefined'){
				nodes.push({
					group: "nodes",
					data: {
         				GraphId: selectedForEditNodes[i].data('GraphId'),
         				LabelSize: selectedForEditNodes[i].data('LabelSize'),
         				SUID: selectedForEditNodes[i].data('SUID'),
         				Type: selectedForEditNodes[i].data('Type'),
         				Valign: selectedForEditNodes[i].data('Valign'),
         				Width: selectedForEditNodes[i].data('Width'),
         				Height: selectedForEditNodes[i].data('Height'),
         				id: selectedForEditNodes[i].data('id'),
         				name: selectedForEditNodes[i].data('name'),
         				selected: selectedForEditNodes[i].data('selected'),
         				shared_name: selectedForEditNodes[i].data('shared_name'),
         				parent: "n"+bundleCounter
       				},
					position: {
						x: selectedForEditNodes[i].position('x'), 
						y: selectedForEditNodes[i].position('y')
					},
					css: { 
      					'border-color': 'red' 
      				} 	
				});
			} else {
				nodes.push({
					group: "nodes",
					data: {
         				GraphId: selectedForEditNodes[i].data('GraphId'),
         				LabelSize: selectedForEditNodes[i].data('LabelSize'),
         				SUID: selectedForEditNodes[i].data('SUID'),
         				Type: selectedForEditNodes[i].data('Type'),
         				Valign: selectedForEditNodes[i].data('Valign'),
         				Width: selectedForEditNodes[i].data('Width'),
         				Height: selectedForEditNodes[i].data('Height'),
         				id: selectedForEditNodes[i].data('id'),
         				name: selectedForEditNodes[i].data('name'),
         				selected: selectedForEditNodes[i].data('selected'),
         				shared_name: selectedForEditNodes[i].data('shared_name'),
         				parent: selectedForEditNodes[i].data('parent')
       				},
					position: {
						x: selectedForEditNodes[i].position('x'), 
						y: selectedForEditNodes[i].position('y')
					},
					css: { 
      					'border-color': 'red' 
      				} 	
				});				
			}
			for (var j=0; j < selectedForEditNodes[i].connectedEdges().size(); j++) {
				edges.push({ 
					group: "edges",
					data : {
        	   			id : selectedForEditNodes[i].connectedEdges()[j].data('id'),
             			SUID : selectedForEditNodes[i].connectedEdges()[j].data('SUID'),
            			LineThickness: selectedForEditNodes[i].connectedEdges()[j].data('LineThickness'),
            			EndArrow: selectedForEditNodes[i].connectedEdges()[j].data('EndArrow'),
            			Coords: selectedForEditNodes[i].connectedEdges()[j].data('Coords'),
            			GraphId: selectedForEditNodes[i].connectedEdges()[j].data('GraphId'),
            			ZOrder: selectedForEditNodes[i].connectedEdges()[j].data('ZOrder'),
            			source: selectedForEditNodes[i].connectedEdges()[j].data('source'),
            			target: selectedForEditNodes[i].connectedEdges()[j].data('target'),
            			StartArrow : selectedForEditNodes[i].connectedEdges()[j].data('StartArrow'),
        				selected : selectedForEditNodes[i].connectedEdges()[j].data('selected')
      				},
      				selected : selectedForEditNodes[i].connectedEdges()[j].selected
    			})
    		}
		}

		// Remove old nodes
		selectedForEditNodes.remove();

		// Add new nodes
		window.cy.add(nodes.concat(edges));
		
		bundleCounter++;
	}
	
	function produceJSON(event){
		var nodes = cy.$('node');
		var edges = cy.$('edge');
		var data = '{"format_version" : "1.0","generated_by" : "cytoscape-3.2.1","target_cytoscapejs_version" : "~2.1","data" :'
		+JSON.stringify(header)+
		',"elements" : {"nodes" :' 
		+ JSON.stringify(nodes.jsons()) + 
		',"edges" :'
		+ JSON.stringify(edges.jsons()) + 
		'}}';
		console.log(data);
//		console.log(JSON.stringify(header));
//		console.log(JSON.stringify(nodes.jsons()));
//		console.log(JSON.stringify(edges.jsons()));
//		console.log(JSON.stringify(cy.elements().jsons()));
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

				// query purpose
				.selector('.green_bg').css({
					'background-color': 'LightGreen',
					'color': 'black'
				})
				.selector('.red_bg').css({
					'background-color': 'LightSalmon',
					'color': 'black'
				})
				.selector('.purple_border').css({
					'border-color': 'MediumPurple',
					'border-width': 3
				})
				.selector('.red_border').css({
					'border-color': 'red',
					'border-width': 3
				})
				.selector('.red_shadow').css({
					'shadow-opacity': 1,
					'shadow-color': 'red',
					'border-width': 1
				})
				.selector('.red_circle').css({
					'background-color': 'red',
					'shape': 'ellipse',
					'background-opacity': 0.5
				})
				.selector('.green_circle').css({
					'background-color': 'green',
					'shape': 'ellipse',
					'background-opacity': 0.5
				})
				.selector('.reset_all').css({
					'background-color': 'white',
					'border-color': 'black',
					'border-width': 1
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
					
					console.log(count);
					
					// RNA
					if (count == 1) {						
						node.addClass('green_bg');
						$('#variable').val($('#variable').val() + node_name + " ");
					} 
					
					if (count == 2) {
						node.removeClass('green_bg');
						node.addClass('red_bg');
						$('#variable').val($('#variable').val() + node_name + " ");
					}
					
					// CNV Added
					if (count == 3) {
						node.addClass('purple_border');
						node.addClass('green_bg');
						node.removeClass('red_bg');
						$('#variable').val($('#variable').val() + node_name + " ");
					}
					
					if (count == 4) {
						node.addClass('purple_border');
						node.addClass('red_bg');
						node.removeClass('green_bg');
						$('#variable').val($('#variable').val() + node_name + " ");
					}
					
					if (count == 5) {
						node.addClass('red_border');
						node.addClass('green_bg');
						node.removeClass('red_bg');
						node.removeClass('purple_border');
						$('#variable').val($('#variable').val() + node_name + " ");
					}
					
					if (count == 6) {
						node.addClass('red_border');
						node.addClass('red_bg');
						node.removeClass('green_bg');
						node.removeClass('purple_border');
						$('#variable').val($('#variable').val() + node_name + " ");
					}
					
					if (count == 7) {
						node.addClass('red_shadow');
						node.addClass('red_bg');
						node.addClass('purple_border');
						
						node.removeClass('green_bg');
						node.removeClass('red_border');
						$('#variable').val($('#variable').val() + node_name + " ");
					}
					
					if (count == 8) {
						node.addClass('red_shadow');
						node.addClass('red_bg');
						node.addClass('red_border');
						
						node.removeClass('green_bg');
						node.removeClass('purple_border');
						$('#variable').val($('#variable').val() + node_name + " ");
					}
					
					if (count == 9) {
						node.addClass('red_shadow');
						node.addClass('green_bg');
						node.addClass('red_border');
						
						node.removeClass('red_bg');
						node.removeClass('purple_border');
						$('#variable').val($('#variable').val() + node_name + " ");
					}
					
					if (count == 10) {
						node.addClass('red_shadow');
						node.addClass('green_bg');
						node.addClass('purple_border');
						
						node.removeClass('red_bg');
						node.removeClass('red_border');
						$('#variable').val($('#variable').val() + node_name + " ");
					}
                   				
				});

				cy.on('cxttapstart ', 'node', function(event){
              				var name = prompt("Enter new name.", event.cyTarget.data('name'));
					if (name != null) {
    					event.cyTarget.data('name', name)
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
	document.getElementById('bundle').addEventListener('click',bundle);
	document.getElementById('produceJSON').addEventListener('click',produceJSON);
}); // on dom ready
