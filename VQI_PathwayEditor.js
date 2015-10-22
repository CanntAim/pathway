var VQI_PathwayEditor = function(parent) {
	//Web services
	var services = {};
	services['pathwayfinder'] = 'http://137.99.11.36/pathwayVisual/PathwayParser/ajaxJSON.php';
	services['pathwaySaver'] = 'http://137.99.11.36/pathwayVisual/PathwayParser/updateDB_json.php';
	services['objectfinder'] = 'http://137.99.11.122/pathway2/qsys_json.php';

	// Globals
	var states = [];
	var stateRecycle = [];
	var lastEvent = 0;
	var selectedForQueryNodes = [];
	var selectedForEditNodes = [];
	var orderedSelectedNodes = [];
	var selectedForEditEdges = [];
	var coloredNodes = [];
	var bundleCounter = 0;
	var edgeCounter = 0;
	var nodeCounter = 0;
	var loadCounts = 0;
	var target = 0;
	var header = "";
	var counts = {};
	var str_info;
	//var rna2Color = {'red_bg',[1,2,3,4,5],'green_bg',[6,7,8,9,10]}
	//var cnv2Color = {'red_border',[1,2,3,4,5],'purple_border',[6,7,8,9,10]}
	//var mut2Color = {'',[1,2,3,4,5],'red_shadow',[6,7,8,9,10]}

	// Outer Control Layout

	//	var parentDiv = document.getElementById(parent);

	var strVar = "";
	strVar += " <label for=\"" + parent + "-file-pathway\">Local Pathway File:<\/label>";
	strVar += "	<input id=\"" + parent + "-file-pathway\" value=\"Pick Pathway File\" type=\"file\"><\/input>";
	strVar += " <label for=\"" + parent + "-file-coloring\">Local Pathway Coloring:<\/label>";
	strVar += "	<input id=\"" + parent + "-file-coloring\" value=\"Pick Spray File\" type=\"file\"><\/input>";
	strVar += " <label for=\"" + parent + "-pathwaySelector\">Pathway:<\/label>";
	strVar += " <select style=\"width: 150px\" id=\"" + parent + "-pathwaySelector\" name=\"" + parent + "-pathwaySelector\">";
	strVar += "  	<option selected=\"\">Please Select<\/option>";
	strVar += "	<\/select>";
	strVar += "	<input id=\"" + parent + "-addNode\" value=\"Add Node\" type=\"button\"><\/input>";
	strVar += "	<input id=\"" + parent + "-addEdge\" value=\"Add Edge\" type=\"button\"><\/input>";
	strVar += "	<input id=\"" + parent + "-deleteEdges\" value=\"Delete Selected Edge(s)\" type=\"button\"><\/input>";
	strVar += "	<input id=\"" + parent + "-deleteNodes\" value=\"Delete Selected Node(s)\" type=\"button\"><\/input>";
	strVar += "	<input id=\"" + parent + "-bundle\" value=\"Bundle\" type=\"button\"><\/input>";
	strVar += "	<input id=\"" + parent + "-unbundle\" value=\"Unbundle\" type=\"button\"><\/input>";
	strVar += "	<input id=\"" + parent + "-findPath\" value=\"Find Pathway\" type=\"button\"><\/input>";
	strVar += "	<input id=\"" + parent + "-produceJSON\" value=\"Export JSON\" type=\"button\"><\/input>";
	strVar += "	<input id=\"" + parent + "-undo\" value=\"Undo\" type=\"button\"><\/input>";
	strVar += "	<input id=\"" + parent + "-redo\" value=\"Redo\" type=\"button\"><\/input>";
	strVar += "	<input id=\"" + parent + "-pathwaySave\" value=\"Save\" type=\"button\"><\/input>";
	strVar += "	<input id=\"" + parent + "-pathwaySaveAs\" value=\"SaveAs\" type=\"button\"><\/input>";
	strVar += " <input id=\"" + parent + "-findObject\" value=\"Find Object\" type=\"button\"><\/input>";
	strVar += " <div id=\"" + parent + "-dialog-table\" title=\"Object Table\">";
	strVar += "	<table id=\"" + parent + "-inner-table\" class=\".table\">"
	strVar += "		<tr>"
	strVar += "         <td>name</td>"
	strVar += "			<td>percentage</td>"
	strVar += "			<td>rna distance</td>"
	strVar += "			<td>cnv distance</td>"
	strVar += "			<td>mut distance</td>"
	strVar += "	</table>"
	strVar += "	<\/div>";
	strVar += " <div id=\"" + parent + "-dialog-form-save-as-pathway\" title=\"Find path\">";
	strVar += " 		<form>";
	strVar += "    		<fieldset>";
	strVar += "      			<label for=\"" + parent + "-pathway-name\">pathway-name:<\/label>";
	strVar += " 				<input type=\"text\" name=\"" + parent + "-pathway-name\" id=\"" + parent + "-pathway-name\"><br>";
	strVar += " 				<input type=\"submit\" tabindex=\"-1\" style=\"position:absolute; top:-1000px\"><\/input>";
	strVar += "    		<\/fieldset>";
	strVar += " 		<\/form>";
	strVar += "	<\/div>";
	strVar += " <div id=\"" + parent + "-dialog-bundle\" title=\"Find path\">";
	strVar += " 		<form>";
	strVar += "    		<fieldset>";
	strVar += "      			<label for=\"" + parent + "-type-bundle\">type:<\/label>";
	strVar += "      			<select style=\"width: 150px\" id=\"" + parent + "-type-bundle\" name=\"" + parent + "-type-bundle\">";
	strVar += "  					<option selected=\"\">Please Select<\/option>";
	strVar += "  					<option>bundle_type_1<\/option>";
	strVar += "  					<option>bundle_type_2<\/option>";
	strVar += "				<\/select>";
	strVar += "    		<\/fieldset>";
	strVar += " 		<\/form>";
	strVar += "	<\/div>";
	strVar += " <div id=\"" + parent + "-dialog-form-find-path\" title=\"Find path\">";
	strVar += " 		<form>";
	strVar += "    		<fieldset>";
	strVar += "      			<label for=\"" + parent + "-sid\">sid:<\/label>";
	strVar += " 				<input type=\"text\" name=\"" + parent + "-sid\" id=\"" + parent + "-sid\"><br>";
	strVar += "      			<label for=\"" + parent + "-vid\">vid:<\/label>";
	strVar += " 				<input type=\"text\" name=\"" + parent + "-vid\" id=\"" + parent + "-vid\"><br>";
	strVar += " 				<input type=\"submit\" tabindex=\"-1\" style=\"position:absolute; top:-1000px\"><\/input>";
	strVar += "    		<\/fieldset>";
	strVar += " 		<\/form>";
	strVar += "	<\/div>";
	strVar += "	<div id=\"" + parent + "-dialog-form-edge\" title=\"Edit edge\">";
	strVar += " 		<form>";
	strVar += "    		<fieldset>";
	strVar += "      			<label for=\"" + parent + "-direction\">change direction:<\/label>";
	strVar += "      			<input type=\"checkbox\" name=\"" + parent + "-direction\" id=\"" + parent + "-direction\" value=\"Yes\"><\/input>";
	strVar += "      			<label for=\"" + parent + "-type-edge\">type:<\/label>";
	strVar += "      			<select style=\"width: 150px\" id=\"" + parent + "-type-edge\" name=\"" + parent + "-type-edge\">";
	strVar += "  					<option selected=\"\">Please Select<\/option>";
	strVar += "  					<option>TBar<\/option>";
	strVar += "  					<option>Arrow<\/option>";
	strVar += "  					<option>Line<\/option>";
	strVar += "				<\/select>";
	strVar += " 			<input type=\"submit\" tabindex=\"-1\" style=\"position:absolute; top:-1000px\"><\/input>";
	strVar += "    		<\/fieldset>";
	strVar += "  		<\/form>";
	strVar += "	<\/div>";
	strVar += "	<div id=\"" + parent + "-dialog-form-node\" title=\"Edit node\">";
	strVar += " 		<form>";
	strVar += "    		<fieldset>";
	strVar += "      			<label for=\"" + parent + "-gene-name\">gene-name:<\/label>";
	strVar += "      			<input type=\"text\" name=\"" + parent + "-gene-name\" id=\"" + parent + "-gene-name\" value=\"\" class=\"text ui-widget-content ui-corner-all\"><\/input>";
	strVar += "      			<label for=\"" + parent + "-height\">height:<\/label>";
	strVar += "      			<input type=\"text\" name=\"" + parent + "-height\" id=\"" + parent + "-height\" value=\"\" class=\"text ui-widget-content ui-corner-all\"><\/input>";
	strVar += "      			<label for=\"" + parent + "-width\">width:<\/label>";
	strVar += "      			<input type=\"text\" name=\"" + parent + "-width\" id=\"" + parent + "-width\" value=\"\" class=\"text ui-widget-content ui-corner-all\"><\/input>";
	strVar += "      			<label for=\"" + parent + "-type-node\">type:<\/label>";
	strVar += "      			<select style=\"width: 150px\" id=\"" + parent + "-type-node\" name=\"" + parent + "-type-node\">";
	strVar += "  					<option selected=\"\">Please Select<\/option>";
	strVar += "  					<option>bundle_type_1<\/option>";
	strVar += "  					<option>bundle_type_2<\/option>";
	strVar += "					<\/select>";
	strVar += "      			<label for=\"" + parent + "-rna\">RNA:<\/label>";
	strVar += "      			<input type=\"text\" style=\"width: 150px\" id=\"" + parent + "-rna\" name=\"" + parent + "-rna\">";
	strVar += "					<label for=\"" + parent + "-cnv\">CNV:<\/label>";
	strVar += "      			<input type=\"text\" style=\"width: 150px\" id=\"" + parent + "-cnv\" name=\"" + parent + "-cnv\">";
	strVar += "					<label for=\"" + parent + "-mut\">MUT:<\/label>";
	strVar += "      			<input type=\"text\" style=\"width: 150px\" id=\"" + parent + "-mut\" name=\"" + parent + "-mut\">";
	strVar += " 			    <input type=\"submit\" tabindex=\"-1\" style=\"position:absolute; top:-1000px\"><\/input>";
	strVar += "    		<\/fieldset>";
	strVar += "  		<\/form>";
	strVar += "	<\/div>";
	strVar += "	<div id=\"" + parent + "-cy\" style=\"height: 100%;width: 100%;position: absolute; left: 0;\"><\/div>";

	document.getElementById(parent).innerHTML = strVar;

	$(function() {// on dom ready
		function onChangePathwayFile(event) {
			var reader = new FileReader();
			reader.onload = onPathwayReaderLoad;
			reader.readAsText(event.target.files[0]);
		}

		function onChangeColoringFile(event) {
			var reader = new FileReader();
			reader.onload = onColoringReaderLoad;
			reader.readAsText(event.target.files[0]);
		}

		function setElements(obj) {
			if (loadCounts == 0) {
				header = obj.data;
				visual_pathway(obj);
			} else {
				for (var i = 0; i < obj.elements.nodes.length; i++) {
					obj.elements.nodes[i].position.x = obj.elements.nodes[i].position.x + 1000 * loadCounts;
				}
				window.cy.add(obj.elements)
			}
			loadCounts++;
		}

		function onSelect(event) {
			var val = event.target.value;
			$.post(services['pathwayfinder'], {
				pid : val
			}, function(data) {
				console.log(data);
				console.log(obj);
				var obj = JSON.parse(data);
				setElements(obj);
			});
		}

		function saveAsPathway(event) {
			var obj = JSON.parse(states[states.length - 1]);
			obj.data.NAME = document.getElementById(parent + "-pathway-name").value;
			$.post(services['pathwaySaver'], {
				insertPathway : obj
			}, function(data) {
				console.log(data);
				refreshPathwayList();
				dialogPathwaySaveAs.dialog("close");
			});
		}

		function savePathway(event) {
			var obj = JSON.parse(states[states.length - 1]);
			$.post(services['pathwaySaver'], {
				updatePathway : obj
			}, function(data) {
				console.log(data);
				dialogPathwaySaveAs.dialog("close");
			});
		}

		function onPathwayReaderLoad(event) {
			var obj = JSON.parse(event.target.result);
			setElements(obj);
		}

		function onColoringReaderLoad(event) {
			var list = this.result.split('\n');
			sprayColor(list);
		}

		function sprayColor(list) {
			var lines = [];
			for (var line = 1; line < list.length; line++) {
				lines[line] = list[line].split('\t');
				var target = cy.elements("node[name = \"" + lines[line][0] + "\"]");
				var mut = lines[line][1];
				var cnv = lines[line][2];
				var rna = lines[line][3];
				target.data('rna', rna);
				target.data('cnv', cnv);
				target.data('mut', mut);

				if (rna > 0) {
					setNodeStyle(target, 'red_bg', '', '');
				} else if (rna < 0) {
					setNodeStyle(target, 'green_bg', '', '');
				} else {
					setNodeStyle(target, 'white_bg', '', '');
				}

				if (cnv > 0) {
					setNodeStyle(target, '', 'red_border', '');
				} else if (cnv < 0) {
					setNodeStyle(target, '', 'purple_border', '');
				} else {
					setNodeStyle(target, '', 'black_border', '');
				}

				if (mut > 0) {
					setNodeStyle(target, '', '', 'red_shadow');
				} else if (mut <= 0) {
					setNodeStyle(target, '', '', 'no_shadow');
				} else {
					setNodeStyle(target, '', '', '');
				}
			}
		}

		function removeNodes(event) {
			saveState();
			selectedForEditNodes.remove();
		}

		function removeEdges(event) {
			saveState();
			selectedForEditEdges.remove();
		}

		function addNode(event) {
			saveState();
			var name = "n" + nodeCounter;
			var node = [];

			node.push({
				group : "nodes",
				data : {
					LabelSize : 10,
					Type : "Protein",
					Valign : "Middle",
					Width : 100,
					Height : 25,
					id : name,
					name : name,
					selected : false
				},
				position : {
					x : 500,
					y : 500
				}
			})

			nodeCounter++;
			window.cy.add(node);
		}

		function addEdge(event) {
			saveState();
			for (var i = 0; i < selectedForEditNodes.length - 1; i++) {
				var sourceE = selectedForEditNodes[i].data('id');
				var targetE = selectedForEditNodes[i + 1].data('id');

				var edge = [];

				edge.push({
					group : "edges",
					data : {
						id : "e" + edgeCounter,
						LineThickness : 1.0,
						EndArrow : "Line",
						Coords : [{
							"x" : 0,
							"y" : 0
						}, {
							"x" : 0,
							"y" : 0
						}],
						ZOrder : "12288",
						source : sourceE,
						target : targetE,
						StartArrow : "Line",
						selected : false
					}
				})

				edgeCounter++;
				window.cy.add(edge);
			}
		}

		function unbundle(event) {
			saveState();

			var nodes = [];
			var edges = [];

			for (var i = 0; i < selectedForEditNodes.size(); i++) {
				nodes.push({
					group : "nodes",
					data : {
						LabelSize : selectedForEditNodes[i].data('LabelSize'),
						Type : selectedForEditNodes[i].data('Type'),
						Valign : selectedForEditNodes[i].data('Valign'),
						Width : selectedForEditNodes[i].data('Width'),
						Height : selectedForEditNodes[i].data('Height'),
						id : selectedForEditNodes[i].data('id'),
						name : selectedForEditNodes[i].data('name'),
						selected : selectedForEditNodes[i].data('selected'),
					},
					position : {
						x : selectedForEditNodes[i].position('x'),
						y : selectedForEditNodes[i].position('y')
					}
				});

				for (var j = 0; j < selectedForEditNodes[i].connectedEdges().size(); j++) {
					edges.push({
						group : "edges",
						data : {
							id : selectedForEditNodes[i].connectedEdges()[j].data('id'),
							LineThickness : selectedForEditNodes[i].connectedEdges()[j].data('LineThickness'),
							EndArrow : selectedForEditNodes[i].connectedEdges()[j].data('EndArrow'),
							Coords : selectedForEditNodes[i].connectedEdges()[j].data('Coords'),
							ZOrder : selectedForEditNodes[i].connectedEdges()[j].data('ZOrder'),
							source : selectedForEditNodes[i].connectedEdges()[j].data('source'),
							target : selectedForEditNodes[i].connectedEdges()[j].data('target'),
							StartArrow : selectedForEditNodes[i].connectedEdges()[j].data('StartArrow'),
							selected : selectedForEditNodes[i].connectedEdges()[j].data('selected')
						}
					})
				}
			}

			// Remove old nodes
			selectedForEditNodes.remove();

			// Add new nodes
			window.cy.add(nodes.concat(edges));
		}

		function bundle(event) {
			saveState();
			var type = document.getElementById(parent + "-type-bundle").value;
			var nodes = [];
			var edges = [];
			// Create new parent
			nodes.push({
				group : "nodes",
				data : {
					LabelSize : 10,
					Type : type,
					Valign : "Middle",
					Width : 80.75,
					Height : 100,
					id : "n" + bundleCounter,
					name : "n" + bundleCounter,
					selected : false
				},
				position : {
					x : 500,
					y : 500
				}
			})

			// Create copies of old nodes
			for (var i = 0; i < selectedForEditNodes.size(); i++) {
				if ( typeof selectedForEditNodes[i].data('parent') == 'undefined') {
					nodes.push({
						group : "nodes",
						data : {
							LabelSize : selectedForEditNodes[i].data('LabelSize'),
							Type : selectedForEditNodes[i].data('Type'),
							Valign : selectedForEditNodes[i].data('Valign'),
							Width : selectedForEditNodes[i].data('Width'),
							Height : selectedForEditNodes[i].data('Height'),
							id : selectedForEditNodes[i].data('id'),
							name : selectedForEditNodes[i].data('name'),
							selected : selectedForEditNodes[i].data('selected'),
							parent : "n" + bundleCounter
						},
						position : {
							x : selectedForEditNodes[i].position('x'),
							y : selectedForEditNodes[i].position('y')
						}
					});
				} else {
					nodes.push({
						group : "nodes",
						data : {
							LabelSize : selectedForEditNodes[i].data('LabelSize'),
							Type : selectedForEditNodes[i].data('Type'),
							Valign : selectedForEditNodes[i].data('Valign'),
							Width : selectedForEditNodes[i].data('Width'),
							Height : selectedForEditNodes[i].data('Height'),
							id : selectedForEditNodes[i].data('id'),
							name : selectedForEditNodes[i].data('name'),
							selected : selectedForEditNodes[i].data('selected'),
							parent : selectedForEditNodes[i].data('parent')
						},
						position : {
							x : selectedForEditNodes[i].position('x'),
							y : selectedForEditNodes[i].position('y')
						}
					});
				}
				for (var j = 0; j < selectedForEditNodes[i].connectedEdges().size(); j++) {
					edges.push({
						group : "edges",
						data : {
							id : selectedForEditNodes[i].connectedEdges()[j].data('id'),
							LineThickness : selectedForEditNodes[i].connectedEdges()[j].data('LineThickness'),
							EndArrow : selectedForEditNodes[i].connectedEdges()[j].data('EndArrow'),
							Coords : selectedForEditNodes[i].connectedEdges()[j].data('Coords'),
							ZOrder : selectedForEditNodes[i].connectedEdges()[j].data('ZOrder'),
							source : selectedForEditNodes[i].connectedEdges()[j].data('source'),
							target : selectedForEditNodes[i].connectedEdges()[j].data('target'),
							StartArrow : selectedForEditNodes[i].connectedEdges()[j].data('StartArrow'),
							selected : selectedForEditNodes[i].connectedEdges()[j].data('selected')
						}
					})
				}
			}

			// Remove old nodes
			selectedForEditNodes.remove();

			// Add new nodes
			window.cy.add(nodes.concat(edges));

			bundleCounter++;

			// Remove dialog box
			dialogBundle.dialog("close");
		}

		function produceJSON(event) {
			download(states[states.length - 1], "data.txt", "text/plain");
		}

		function refreshPathwayList() {
			var select = document.getElementById(parent + "-pathwaySelector");

			$.get(services['pathwayfinder'], {
				pathwayList : '1'
			}, function(data) {
				var obj = JSON.parse(data);
				for (var i = 0; i < obj.length; i++) {
					var opt = obj[i].NAME;
					var val = obj[i].ID;
					var el = document.createElement("option");
					el.textContent = opt;
					el.value = val;
					select.appendChild(el);
				}
			});

		}

		function findPath(Json, sid, vid) {
			var nodes = Json['elements']['nodes'];
			nodes = nodes.filter(function(item) {
				if (item['data']['NODE_TYPE'] !== 'GROUP') {
					return true;
				}

			});
			//console.log(nodes);
			var edges = Json['elements']['edges'];
			var result = [];
			//array of arrays containing the graphids for edges in the path
			var path = [];
			var nodeTrack = [];

			function mapLocation(x, y) {
				var deta = 1;

				for (var j = 0; j < nodes.length; j++) {
					var x0 = nodes[j]['position']['x'];
					var y0 = nodes[j]['position']['y'];
					var w = nodes[j]['data']['Width'];
					var h = nodes[j]['data']['Height'];

					if (x > x0 - w / 2 - deta & x < x0 + w / 2 + deta & y > y0 - h / 2 - deta & y < y0 + h / 2 + deta) {
						return nodes[j]['data']['SUID'];

					}
				}
			}

			function findEdgeBySource(gid) {
				if (gid == undefined | gid == '0') {
					return;
				}

				var end = true;
				for (var i = 0; i < edges.length; i++) {
					var eid = edges[i]['data']['id'];
					var s = (!('source' in edges[i]['data']) ? mapLocation(edges[i]['data']['Coords'][0]['x'], edges[i]['data']['Coords'][0]['y']) : edges[i]['data']['source']);

					if (s == gid) {

						var cl = edges[i]['data']['Coords'].length;
						var t = (!('target' in edges[i]['data']) ? mapLocation(edges[i]['data']['Coords'][cl - 1]['x'], edges[i]['data']['Coords'][cl - 1]['y']) : edges[i]['data']['target']);

						if (t == vid) {
							//console.log(path);
							var p = path.slice();
							p.push(eid);
							result.push(p);
							//                    console.log(path);
							//                    console.log(nodeTrack);
							//                    console.log('result find! ')
							//                    console.log(result);

							//nodeTrack = [];
							continue;

						} else if (nodeTrack.indexOf(eid) == -1 & t !== undefined & t !== '0') {
							path.push(eid);
							nodeTrack.push(eid);
							//                    console.log('new node added but not dest')
							//                    console.log(path);
							//                    console.log(result);
							findEdgeBySource(t);
						} else {//there is a loop
							continue;

						}

					}
				}
				if (end == true) {
					//console.log('dead end')
					path.pop();
					nodeTrack.pop();
					//            console.log(path);
					//            console.log(nodeTrack);

				}
				return true;
				//console.log(mapLocation(60.75,188.75))

			}

			findEdgeBySource(sid);
			return result;

		}

		function wrapperFindPath() {
			saveState();
			var sid = orderedSelectedNodes[0]._private.data['id'];
			var vid = orderedSelectedNodes[1]._private.data['id'];
			var result = findPath(JSON.parse(states[states.length - 1]), sid, vid);
			if ( typeof (result) == "undefined")
				dialogPathfind.dialog("close");
			for (var i = 0; i < result.length; i++) {
				for (var j = 0; j < result[i].length; j++) {
					cy.elements("edge[id = \"" + result[i][j] + "\"]").select();
					var sourceNode = cy.elements("edge[id = \"" + result[i][j] + "\"]").data('source');
					var targetNode = cy.elements("edge[id = \"" + result[i][j] + "\"]").data('target');
					cy.elements("node[id = \"" + targetNode + "\"]").select();
					cy.elements("node[id = \"" + sourceNode + "\"]").select();
				}
			}
			dialogPathfind.dialog("close");
		}

		function saveState() {
			var nodes = cy.$('node');
			var edges = cy.$('edge');
			var data = '{"format_version" : "1.0","generated_by" : "cytoscape-3.2.1","target_cytoscapejs_version" : "~2.1","data" :' + JSON.stringify(header) + ',"elements" : {"nodes" :' + JSON.stringify(nodes.jsons()) + ',"edges" :' + JSON.stringify(edges.jsons()) + '}}';
			states.push(data);
		}

		function undo() {
			if (states.length > 1) {
				cy.$('node').remove();
				cy.$('edge').remove();
				stateRecycle.push(states.pop());
				var obj = JSON.parse(states[states.length - 1]);
				window.cy.add(obj.elements)
			}
		}

		function redo() {
			if (stateRecycle.length > 1) {
				cy.$('node').remove();
				cy.$('edge').remove();
				states.push(stateRecycle.pop());
				var obj = JSON.parse(states[states.length - 1]);
				window.cy.add(obj.elements)
			}
		}

		function visual_pathway(obj) {
			$('#' + parent + '-cy').cytoscape({
				style : cytoscape.stylesheet()

				// node elements default css (unselected state)
				.selector('node').css({
					'content' : 'data(name)',
					'text-valign' : 'center',
					'color' : 'black',
					'padding-left' : 2,
					'padding-right' : 2,
					'font-family' : 'data(LabelSize)',
					'background-color' : 'white'
				}).selector('node[Type="GeneProduct"]').css({
					'shape' : 'rectangle',
					'width' : 'data(Width)',
					'height' : 'data(Height)',
					'text-valign' : 'middle',
					'background-color' : 'white',
					'border-color' : 'black',
					'border-width' : 1
				}).selector('node[Type="Protein"]').css({
					'shape' : 'rectangle',
					'width' : 'data(Width)',
					'height' : 'data(Height)',
					'background-color' : 'white',
					'color' : '#ff3333',
					'border-color' : '#ff3333',
					'border-style' : 'solid',
					'border-width' : 1
				}).selector('node[Type="unknown"]').css({
					'shape' : 'rectangle',
					'background-color' : 'grey',
					'color' : 'grey',
					'border-color' : 'grey',
					'border-style' : 'solid',
					'border-width' : 1
				}).selector('node[Type="bundle_type_1"]').css({
					'shape' : 'rectangle',
					'background-color' : 'white',
					'color' : 'white',
					'border-color' : 'black',
					'border-style' : 'solid',
					'border-width' : 1
				}).selector('node[Type="bundle_type_2"]').css({
					'shape' : 'roundrectangle',
					'background-color' : 'white',
					'color' : 'white',
					'border-color' : 'black',
					'border-style' : 'solid',
					'border-width' : 1
				}).selector('node[Shape="Brace"]').css({
					'shape' : 'rectangle',
					'width' : '1',
					'height' : 'data(Width)',
					'background-color' : 'black',
					'color' : 'black',
					'border-color' : 'black',
					'border-style' : 'solid',
					'border-width' : 1
				}).selector('node[FillColor="ffffff"]').css({
					'background-color' : 'white',
					'color' : 'blue',
					'text-halign' : 'center',
					'text-valign' : 'top'
				})

				// edge elements default css (unselected)
				.selector('edge').css({
					'line-color' : 'black',
					'line-style' : 'solid',
					'width' : 1
				}).selector('edge[LineStyle="Dashed"]').css({
					'line-style' : 'dashed',
					'line-color' : 'black',
					'background-color' : 'black',
					'color' : 'black'
				}).selector('edge[EndArrow="Arrow"]').css({
					'target-arrow-shape' : 'triangle',
					'target-arrow-color' : 'black',
					'target-arrow-fill' : 'filled'
				}).selector('edge[EndArrow="TBar"]').css({
					'target-arrow-shape' : 'tee',
					'target-arrow-color' : 'black',
					'target-arrow-fill' : 'filled'
				}).selector('edge[ConnectorType="Elbow"]').css({
					'line-color' : 'yellow',
					'line-style' : 'solid'
				})

				// node & edge elements (selected state)
				.selector('edge:selected').css({
					'background-color' : 'green',
					'line-color' : 'green',
					'target-arrow-color' : 'green',
					'source-arrow-color' : 'green'
				}).selector('node:selected').css({
					'background-color' : 'green'
				})

				// misc
				.selector('.faded').css({
					'opacity' : 1,
					'text-opacity' : 0
				})

				// query purpose
				.selector('.green_bg').css({
					'background-color' : 'LightGreen',
					'color' : 'black'
				}).selector('.red_bg').css({
					'background-color' : 'LightSalmon',
					'color' : 'black'
				}).selector('.white_bg').css({
					'background-color' : 'white',
					'color' : 'black'
				}).selector('.purple_border').css({
					'border-color' : 'MediumPurple',
					'border-width' : 3
				}).selector('.red_border').css({
					'border-color' : 'red',
					'border-width' : 3
				}).selector('.black_border').css({
					'border-color' : 'black',
					'border-width' : 3
				}).selector('.red_shadow').css({
					'shadow-opacity' : 1,
					'shadow-color' : 'red',
					'border-width' : 1
				}).selector('.no_shadow').css({
					'shadow-opacity' : 0,
					'shadow-color' : 'red',
					'border-width' : 1
				}).selector('.red_circle').css({
					'background-color' : 'red',
					'shape' : 'ellipse',
					'background-opacity' : 0.5
				}).selector('.green_circle').css({
					'background-color' : 'green',
					'shape' : 'ellipse',
					'background-opacity' : 0.5
				}).selector('.reset_all').css({
					'background-color' : 'white',
					'border-color' : 'black',
					'border-width' : 1
				}),
				elements : obj.elements,
				layout : {
					name : 'preset',
					padding : 10
				},
				ready : function() {
					window.cy = this;

					// add custom event
					var cy = $('#' + parent + '-cy').cytoscape('get');
					var tappedBefore = null;
					cy.on('tap', function(event) {
						var tappedNow = event.cyTarget;
						setTimeout(function() {
							tappedBefore = null;
						}, 300);
						if (tappedBefore === tappedNow) {
							tappedNow.trigger('doubleTap');
							tappedBefore = null;
						} else {
							tappedBefore = tappedNow;
						}
					});

					// custom event handlers
					cy.on('click', 'node', function(event) {
						if (orderedSelectedNodes.length < 2)
							orderedSelectedNodes.push(event.cyTarget);
						else
							orderedSelectedNodes.shift();
						orderedSelectedNodes.push(event.cyTarget);
					});

					cy.on('doubleTap', 'node', function(event) {
						target = event.cyTarget;
						dialogNode.dialog("open");
					});

					cy.on('doubleTap', 'edge', function(event) {
						target = event.cyTarget;
						dialogEdge.dialog("open");
					});

					cy.on('select', 'node', function(event) {
						selectedForEditNodes = cy.$('node:selected');
						//			    	saveState();
					});

					cy.on('unselect', 'node', function(event) {
						selectedForEditNodes = cy.$('node:selected');
						//			    	saveState();
					});

					cy.on('select', 'edge', function(event) {
						selectedForEditEdges = cy.$('edge:selected');
						//			    	saveState();
					});

					cy.on('unselect', 'edge', function(event) {
						selectedForEditEdges = cy.$('edge:selected');
						//			    	saveState();
					});

					cy.on('free', 'node', function(event) {
						saveState();
					});

					cy.on('data', 'node', function(event) {
						//					saveState();
					});

					cy.on('style', 'node', function(event) {
						//					saveState();
					});

					saveState();
				},
				// initial viewport state:
				zoom : 1,
				pan : {
					x : 0,
					y : 0
				},
				// interaction options:
				minZoom : 1e-50,
				maxZoom : 1e50,
				zoomingEnabled : true,
				userZoomingEnabled : true,
				panningEnabled : true,
				userPanningEnabled : true,
				boxSelectionEnabled : true,
				selectionType : 'additive',
				touchTapThreshold : 8,
				desktopTapThreshold : 4,
				autolock : false,
				autoungrabify : false,
				autounselectify : false,
				// rendering options:
				headless : false,
				styleEnabled : true,
				hideEdgesOnViewport : false,
				hideLabelsOnViewport : false,
				textureOnViewport : false,
				motionBlur : false,
				motionBlurOpacity : 0.2,
				wheelSensitivity : 1,
				pixelRatio : 1,
				initrender : function(evt) {/* ... */
				},
				renderer : {/* ... */}
			});
		}

		function clone(obj) {
			if (null == obj || "object" != typeof obj)
				return obj;
			var copy = obj.constructor();
			for (var attr in obj) {
				if (obj.hasOwnProperty(attr))
					copy[attr] = obj[attr];
			}
			return copy;
		}

		function setNodeStyle(target, background, border, shadow) {
			if (background != '') {
				target.removeClass('green_bg');
				target.removeClass('red_bg');
				target.removeClass('white_bg');
				target.addClass(background);
			}
			if (border != '') {
				target.removeClass('purple_border');
				target.removeClass('red_border');
				target.removeClass('black_border');
				target.addClass(border);
			}
			if (shadow != '') {
				target.removeClass('red_shadow');
				target.removeClass('no_shadow');
				target.addClass(shadow);
			}
		}

		function editEdge() {
			saveState();
			var direction = document.getElementById(parent + "-direction").value;
			var type = document.getElementById(parent + "-type-edge").value;
			target.data('StartArrow', type);
			target.data('EndArrow', type);
			if (document.getElementById(parent + '-direction').checked) {
				var edge = [];

				edge.push({
					group : "edges",
					data : {
						id : target.data('id'),
						LineThickness : target.data('LineThickness'),
						EndArrow : target.data('EndArrow'),
						Coords : target.data('Coords'),
						ZOrder : target.data('ZOrder'),
						source : target.data('target'),
						target : target.data('source'),
						StartArrow : target.data('StartArrow'),
						selected : target.data('Selected')
					}
				})
				target.remove();
				window.cy.add(edge);
			}
			dialogEdge.dialog("close");
		}

		function editNode() {
			saveState();
			var name = document.getElementById(parent + "-gene-name").value;
			var width = document.getElementById(parent + "-width").value;
			var height = document.getElementById(parent + "-height").value;
			var type = document.getElementById(parent + "-type-node").value;
			target.data('name', name);
			target.data('Width', width);
			target.data('Height', height);
			target.data('Type', type);

			var node_name = target.data("name");
			selectedForQueryNodes.push(node_name);
			var node_id = target.data("id");
			var rna = document.getElementById(parent + "-rna").value;
			var cnv = document.getElementById(parent + "-cnv").value;
			var mut = document.getElementById(parent + "-mut").value;
			target.data('rna', rna);
			target.data('cnv', cnv);
			target.data('mut', mut);

			if (rna > 0) {
				setNodeStyle(target, 'red_bg', '', '');
			} else if (rna < 0) {
				setNodeStyle(target, 'green_bg', '', '');
			} else {
				setNodeStyle(target, 'white_bg', '', '');
			}

			if (cnv > 0) {
				setNodeStyle(target, '', 'red_border', '');
			} else if (cnv < 0) {
				setNodeStyle(target, '', 'purple_border', '');
			} else {
				setNodeStyle(target, '', 'black_border', '');
			}

			if (mut > 0) {
				setNodeStyle(target, '', '', 'red_shadow');
			} else if (mut <= 0) {
				setNodeStyle(target, '', '', 'no_shadow');
			} else {
				setNodeStyle(target, '', '', '');
			}

			coloredNodes.push({
				"gene_name" : node_name,
				"rna" : rna,
				"cnv" : cnv,
				"mut" : mut
			});
			$('#' + parent + '-variable').val($('#' + parent + '-variable').val() + coloredNodes);
			console.log(coloredNodes);
			dialogNode.dialog("close");
		}

		function dialogBundleOpen(event) {
			dialogBundle.dialog("open");
		}

		function dialogPathfindOpen(event) {
			dialogPathfind.dialog("open");
		}

		function dialogPathwaySaveAsOpen(event) {
			dialogPathwaySaveAs.dialog("open");
		}

		function findObject(event) {
			console.log(coloredNodes);
			var val = event.target.value;
			$.post(services['objectfinder'], {
				pattern : JSON.stringify(coloredNodes)
			}, function(data) {
				if (data == "[]")
					data = '{"X1":{"percentage":0.66667,"rna_distance":0,"cnv_distance":0,"mut_distance":0},"X2":{"percentage":0.33333,"rna_distance":30.44444,"cnv_distance":0,"mut_distance":0},"X9":{"percentage":0.66667,"rna_distance":0,"cnv_distance":0,"mut_distance":0},"X29":{"percentage":0.66667,"rna_distance":0,"cnv_distance":0,"mut_distance":0},"X24":{"percentage":0.33333,"rna_distance":36,"cnv_distance":0,"mut_distance":0},"X34":{"percentage":0.66667,"rna_distance":0,"cnv_distance":0,"mut_distance":0},"X38":{"percentage":0.33333,"rna_distance":30.44444,"cnv_distance":0,"mut_distance":0},"X40":{"percentage":0.66667,"rna_distance":0,"cnv_distance":0,"mut_distance":0},"X45":{"percentage":0.66667,"rna_distance":36,"cnv_distance":0,"mut_distance":0},"X46":{"percentage":0.66667,"rna_distance":0,"cnv_distance":0,"mut_distance":0},"X48":{"percentage":1,"rna_distance":36,"cnv_distance":0,"mut_distance":0},"X53":{"percentage":1,"rna_distance":0,"cnv_distance":0,"mut_distance":0},"X59":{"percentage":0.66667,"rna_distance":36,"cnv_distance":0,"mut_distance":0},"X156":{"percentage":0.33333,"rna_distance":0,"cnv_distance":0,"mut_distance":0},"X15":{"percentage":0.33333,"rna_distance":0,"cnv_distance":0,"mut_distance":2},"X22":{"percentage":0.33333,"rna_distance":0,"cnv_distance":0,"mut_distance":0}}'
				var array = data.split("},");
				for (var i = 0; i < array.length; i++) {
					array[i] = array[i].split(":{");
					array[i][1] = array[i][1].split(",");
					array[i][0] = array[i][0].replace(/\W/g, '');
					for (var j = 0; j < array[i][1].length; j++) {
						array[i][1][j] = array[i][1][j].replace(/[^\d.-]/g, '');
					}
				}

				console.log(array);

				var table = document.getElementById(parent + "-inner-table");
				var length = document.getElementById(parent + "-inner-table").rows.length;
				for (var n = 1; n < length; n++) {
					table.deleteRow(1);
				}
				for (var n = 0; n < array.length; n++) {
					var row = table.insertRow();

					var name = row.insertCell(0)
					var percentage = row.insertCell(1);
					var rna_distance = row.insertCell(2);
					var cnv_distance = row.insertCell(3);
					var mut_distance = row.insertCell(4);

					// Add some text to the new cells:
					name.innerHTML = array[n][0];
					percentage.innerHTML = array[n][1][0];
					rna_distance.innerHTML = array[n][1][1];
					cnv_distance.innerHTML = array[n][1][2];
					mut_distance.innerHTML = array[n][1][3];
				}
				//document.getElementById(parent + "-dialog-table").innerHTML = data;
				dialogTable.dialog("open")
				console.log(data);
			});

		}

		dialogTable = $("#" + parent + "-dialog-table").dialog({
			autoOpen : false,
			height : 300,
			width : 350,
			buttons : {
				Cancel : function() {
					dialogTable.dialog("close");
				}
			},
			close : function() {
			}
		});

		dialogNode = $("#" + parent + "-dialog-form-node").dialog({
			open : function(event) {
				document.getElementById(parent + "-gene-name").value = target.data('name');
				document.getElementById(parent + "-width").value = target.data('Height');
				document.getElementById(parent + "-height").value = target.data('Width');
				document.getElementById(parent + "-type-node").value = target.data('Type');
				if ( typeof (target.data('rna')) != "undefined")
					document.getElementById(parent + "-rna").value = target.data('rna');
				else
					document.getElementById(parent + "-rna").value = 'Please Select';

				if ( typeof (target.data('cnv')) != "undefined")
					document.getElementById(parent + "-cnv").value = target.data('cnv');
				else
					document.getElementById(parent + "-cnv").value = 'Please Select';

				if ( typeof (target.data('mut')) != "undefined")
					document.getElementById(parent + "-mut").value = target.data('mut');
				else
					document.getElementById(parent + "-mut").value = 'Please Select';
			},
			autoOpen : false,
			height : 300,
			width : 350,
			buttons : {
				"submit" : editNode,
				Cancel : function() {
					dialogNode.dialog("close");
				}
			},
			close : function() {
			}
		});

		dialogEdge = $("#" + parent + "-dialog-form-edge").dialog({
			autoOpen : false,
			height : 300,
			width : 350,
			buttons : {
				"submit" : editEdge,
				Cancel : function() {
					dialogEdge.dialog("close");
				}
			},
			close : function() {
			}
		});

		dialogPathfind = $("#" + parent + "-dialog-form-find-path").dialog({
			open : function(event) {
				document.getElementById(parent + "-sid").value = orderedSelectedNodes[0]._private.data['name'];
				document.getElementById(parent + "-vid").value = orderedSelectedNodes[1]._private.data['name'];
			},
			autoOpen : false,
			height : 300,
			width : 350,
			buttons : {
				"submit" : wrapperFindPath,
				Cancel : function() {
					dialogPathfind.dialog("close");
				}
			},
			close : function() {
			}
		});

		dialogPathwaySaveAs = $("#" + parent + "-dialog-form-save-as-pathway").dialog({
			autoOpen : false,
			height : 300,
			width : 350,
			buttons : {
				"submit" : saveAsPathway,
				Cancel : function() {
					dialogPathwaySaveAs.dialog("close");
				}
			},
			close : function() {
			}
		});

		dialogBundle = $("#" + parent + "-dialog-bundle").dialog({
			autoOpen : false,
			height : 300,
			width : 350,
			buttons : {
				"submit" : bundle,
				Cancel : function() {
					dialogPathfind.dialog("close");
				}
			},
			close : function() {
			}
		});

		refreshPathwayList();

		document.getElementById(parent + '-file-pathway').addEventListener('change', onChangePathwayFile);
		document.getElementById(parent + '-file-coloring').addEventListener('change', onChangeColoringFile);
		document.getElementById(parent + '-findPath').addEventListener('click', dialogPathfindOpen);
		document.getElementById(parent + '-findObject').addEventListener('click', findObject);
		document.getElementById(parent + '-deleteNodes').addEventListener('click', removeNodes);
		document.getElementById(parent + '-pathwaySelector').addEventListener('change', onSelect);
		document.getElementById(parent + '-pathwaySaveAs').addEventListener('click', dialogPathwaySaveAsOpen);
		document.getElementById(parent + '-pathwaySave').addEventListener('click', savePathway);
		document.getElementById(parent + '-deleteNodes').addEventListener('click', removeNodes);
		document.getElementById(parent + '-deleteEdges').addEventListener('click', removeEdges);
		document.getElementById(parent + '-addNode').addEventListener('click', addNode);
		document.getElementById(parent + '-addEdge').addEventListener('click', addEdge);
		document.getElementById(parent + '-bundle').addEventListener('click', dialogBundleOpen);
		document.getElementById(parent + '-unbundle').addEventListener('click', unbundle);
		document.getElementById(parent + '-produceJSON').addEventListener('click', produceJSON);
		document.getElementById(parent + '-undo').addEventListener('click', undo);
		document.getElementById(parent + '-redo').addEventListener('click', redo);
	});
};
