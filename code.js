// Globals
var selectedForQueryNodes = [];
var selectedForEditNodes = [];
var bundleCounter = 0;
var edgeCounter = 0;
var nodeCounter = 0;
var loadCounts = 0;
var target = 0;
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
	
	function addNode(event) {
		var name = "n"+nodeCounter;
		var node = [];
		
		node.push({ group: "nodes",
      			data: {
         			GraphId: name,
         			LabelSize: 10,
         			SUID: name,
         			Type: "Protein",
         			Valign: "Middle",
         			Width: 100,
         			Height: 25,
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
   		
   		nodeCounter++;		
   		window.cy.add(node);
	}
	
	function addEdge(event){
		for(var i = 0; i < selectedForEditNodes.length-1; i++){
			var sourceE = selectedForEditNodes[i].data('GraphId');
			var targetE = selectedForEditNodes[i+1].data('GraphId');
		
			var edge = [];
		
    		edge.push({ 
				group: "edges",
				data : {
        		   	id : "e"+edgeCounter,
            		SUID : "e"+edgeCounter,
            		LineThickness:1.0,
            		EndArrow:"Line",
           		 	Coords:[{"x":0,"y":0},{"x":0,"y":0}],
           		 	GraphId:"e"+edgeCounter,
           	 		ZOrder:"12288",
            		source:sourceE,
            		target:targetE, 
            		StartArrow : "Line",
        			selected : false
      			},
      			selected : false
    		})
    	
    		edgeCounter++;
    		window.cy.add(edge);
    	}
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
		download(data, "data.txt", "text/plain")
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
					'background-color': 'yellow',
					'line-color': 'yellow',
					'target-arrow-color': 'yellow',
					'source-arrow-color': 'yellow'
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
				cy.on('click', 'node', function (event) {
					
				});

				cy.on('cxttapstart ', 'node', function(event){
					target = event.cyTarget;
					dialogNode.dialog("open");
				});
				
				cy.on('cxttapstart ', 'edge', function(event){
					target = event.cyTarget;
					dialogEdge.dialog("open");
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
  			selectionType: 'additive',
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
	document.getElementById('addNode').addEventListener('click', addNode);
	document.getElementById('addEdge').addEventListener('click', addEdge);
	document.getElementById('bundle').addEventListener('click',bundle);
	document.getElementById('produceJSON').addEventListener('click',produceJSON);
}); // on dom ready
