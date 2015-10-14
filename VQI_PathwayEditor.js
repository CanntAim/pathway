var VQI_PathwayEditor = function (parent) {
    //Web services
    var services = {};
    services['pathwayfinder'] = 'http://137.99.11.36/pathwayVisual/PathwayParser/ajaxJSON.php';
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
    strVar += "	<input id=\"" + parent + "-file\" value=\"Pick File\" type=\"file\"><\/input>";
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
    strVar += " <input id=\"" + parent + "-findObject\" value=\"Find Object\" type=\"button\"><\/input>";
    strVar += " <div id=\"" + parent + "-dialog-table\" title=\"Object Table\">";
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
    strVar += "      			<label for=\"" + parent + "-rna\">RNA:<\/label>";
    strVar += "      			<select style=\"width: 150px\" id=\"" + parent + "-rna\" name=\"" + parent + "-rna\">";
    strVar += "  					<option selected=\"\">Please Select<\/option>";
    strVar += "  					<option>1<\/option>";
    strVar += "  					<option>2<\/option>";
    strVar += "  					<option>3<\/option>";
    strVar += "  					<option>4<\/option>";
    strVar += "  					<option>5<\/option>";
    strVar += "  					<option>6<\/option>";
    strVar += "  					<option>7<\/option>";
    strVar += "  					<option>8<\/option>";
    strVar += "  					<option>9<\/option>";
    strVar += "  					<option>10<\/option>";
    strVar += "				<\/select>";
    strVar += "				<label for=\"" + parent + "-cnv\">CNV:<\/label>";
    strVar += "      			<select style=\"width: 150px\" id=\"" + parent + "-cnv\" name=\"" + parent + "-cnv\">";
    strVar += "  					<option selected=\"\">Please Select<\/option>";
    strVar += "  					<option>1<\/option>";
    strVar += "  					<option>2<\/option>";
    strVar += "  					<option>3<\/option>";
    strVar += "  					<option>4<\/option>";
    strVar += "  					<option>5<\/option>";
    strVar += "  					<option>6<\/option>";
    strVar += "  					<option>7<\/option>";
    strVar += "  					<option>8<\/option>";
    strVar += "  					<option>9<\/option>";
    strVar += "  					<option>10<\/option>";
    strVar += "				<\/select>";
    strVar += "				<label for=\"" + parent + "-mut\">MUT:<\/label>";
    strVar += "      			<select style=\"width: 150px\" id=\"" + parent + "-mut\" name=\"" + parent + "-mut\">";
    strVar += "  					<option selected=\"\">Please Select<\/option>";
    strVar += "  					<option>1<\/option>";
    strVar += "  					<option>2<\/option>";
    strVar += "  					<option>3<\/option>";
    strVar += "  					<option>4<\/option>";
    strVar += "  					<option>5<\/option>";
    strVar += "  					<option>6<\/option>";
    strVar += "  					<option>7<\/option>";
    strVar += "  					<option>8<\/option>";
    strVar += "  					<option>9<\/option>";
    strVar += "  					<option>10<\/option>";
    strVar += "				<\/select>";
    strVar += " 			    <input type=\"submit\" tabindex=\"-1\" style=\"position:absolute; top:-1000px\"><\/input>";
    strVar += "    		<\/fieldset>";
    strVar += "  		<\/form>";
    strVar += "	<\/div>";
    strVar += "	<div id=\"" + parent + "-cy\" style=\"height: 100%;width: 100%;position: absolute; left: 0;\"><\/div>";

    document.getElementById(parent).innerHTML = strVar;

    $(function () {// on dom ready
        function onChange(event) {
            var reader = new FileReader();
            reader.onload = onReaderLoad;
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
                pid: val
            }, function (data) {
                console.log(data);
                console.log(obj);
                var obj = JSON.parse(data);
                setElements(obj);
            });
        }

        function onReaderLoad(event) {
            var obj = JSON.parse(event.target.result);
            setElements(obj);
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
                group: "nodes",
                data: {
                    LabelSize: 10,
                    Type: "Protein",
                    Valign: "Middle",
                    Width: 100,
                    Height: 25,
                    id: name,
                    name: name,
                    selected: false
                },
                position: {
                    x: 500,
                    y: 500
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
                    group: "edges",
                    data: {
                        id: "e" + edgeCounter,
                        LineThickness: 1.0,
                        EndArrow: "Line",
                        Coords: [{
                                "x": 0,
                                "y": 0
                            }, {
                                "x": 0,
                                "y": 0
                            }],
                        ZOrder: "12288",
                        source: sourceE,
                        target: targetE,
                        StartArrow: "Line",
                        selected: false
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
                    group: "nodes",
                    data: {
                        LabelSize: selectedForEditNodes[i].data('LabelSize'),
                        Type: selectedForEditNodes[i].data('Type'),
                        Valign: selectedForEditNodes[i].data('Valign'),
                        Width: selectedForEditNodes[i].data('Width'),
                        Height: selectedForEditNodes[i].data('Height'),
                        id: selectedForEditNodes[i].data('id'),
                        name: selectedForEditNodes[i].data('name'),
                        selected: selectedForEditNodes[i].data('selected'),
                    },
                    position: {
                        x: selectedForEditNodes[i].position('x'),
                        y: selectedForEditNodes[i].position('y')
                    }
                });

                for (var j = 0; j < selectedForEditNodes[i].connectedEdges().size(); j++) {
                    edges.push({
                        group: "edges",
                        data: {
                            id: selectedForEditNodes[i].connectedEdges()[j].data('id'),
                            LineThickness: selectedForEditNodes[i].connectedEdges()[j].data('LineThickness'),
                            EndArrow: selectedForEditNodes[i].connectedEdges()[j].data('EndArrow'),
                            Coords: selectedForEditNodes[i].connectedEdges()[j].data('Coords'),
                            ZOrder: selectedForEditNodes[i].connectedEdges()[j].data('ZOrder'),
                            source: selectedForEditNodes[i].connectedEdges()[j].data('source'),
                            target: selectedForEditNodes[i].connectedEdges()[j].data('target'),
                            StartArrow: selectedForEditNodes[i].connectedEdges()[j].data('StartArrow'),
                            selected: selectedForEditNodes[i].connectedEdges()[j].data('selected')
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
                group: "nodes",
                data: {
                    LabelSize: 10,
                    Type: type,
                    Valign: "Middle",
                    Width: 80.75,
                    Height: 100,
                    id: "n" + bundleCounter,
                    name: "n" + bundleCounter,
                    selected: false
                },
                position: {
                    x: 500,
                    y: 500
                }
            })

            // Create copies of old nodes
            for (var i = 0; i < selectedForEditNodes.size(); i++) {
                if (typeof selectedForEditNodes[i].data('parent') == 'undefined') {
                    nodes.push({
                        group: "nodes",
                        data: {
                            LabelSize: selectedForEditNodes[i].data('LabelSize'),
                            Type: selectedForEditNodes[i].data('Type'),
                            Valign: selectedForEditNodes[i].data('Valign'),
                            Width: selectedForEditNodes[i].data('Width'),
                            Height: selectedForEditNodes[i].data('Height'),
                            id: selectedForEditNodes[i].data('id'),
                            name: selectedForEditNodes[i].data('name'),
                            selected: selectedForEditNodes[i].data('selected'),
                            parent: "n" + bundleCounter
                        },
                        position: {
                            x: selectedForEditNodes[i].position('x'),
                            y: selectedForEditNodes[i].position('y')
                        }
                    });
                } else {
                    nodes.push({
                        group: "nodes",
                        data: {
                            LabelSize: selectedForEditNodes[i].data('LabelSize'),
                            Type: selectedForEditNodes[i].data('Type'),
                            Valign: selectedForEditNodes[i].data('Valign'),
                            Width: selectedForEditNodes[i].data('Width'),
                            Height: selectedForEditNodes[i].data('Height'),
                            id: selectedForEditNodes[i].data('id'),
                            name: selectedForEditNodes[i].data('name'),
                            selected: selectedForEditNodes[i].data('selected'),
                            parent: selectedForEditNodes[i].data('parent')
                        },
                        position: {
                            x: selectedForEditNodes[i].position('x'),
                            y: selectedForEditNodes[i].position('y')
                        }
                    });
                }
                for (var j = 0; j < selectedForEditNodes[i].connectedEdges().size(); j++) {
                    edges.push({
                        group: "edges",
                        data: {
                            id: selectedForEditNodes[i].connectedEdges()[j].data('id'),
                            LineThickness: selectedForEditNodes[i].connectedEdges()[j].data('LineThickness'),
                            EndArrow: selectedForEditNodes[i].connectedEdges()[j].data('EndArrow'),
                            Coords: selectedForEditNodes[i].connectedEdges()[j].data('Coords'),
                            ZOrder: selectedForEditNodes[i].connectedEdges()[j].data('ZOrder'),
                            source: selectedForEditNodes[i].connectedEdges()[j].data('source'),
                            target: selectedForEditNodes[i].connectedEdges()[j].data('target'),
                            StartArrow: selectedForEditNodes[i].connectedEdges()[j].data('StartArrow'),
                            selected: selectedForEditNodes[i].connectedEdges()[j].data('selected')
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

        function findPath(Json, sid, vid) {
            var nodes = Json['elements']['nodes'];
            nodes = nodes.filter(function (item) {
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
            for (var i = 0; i < result[0].length; i++) {
                cy.elements("edge[id = \"" + result[0][i] + "\"]").select();
                var sourceNode = cy.elements("edge[id = \"" + result[0][i] + "\"]").data('source');
                var targetNode = cy.elements("edge[id = \"" + result[0][i] + "\"]").data('target');
                cy.elements("node[id = \"" + targetNode + "\"]").select();
                cy.elements("node[id = \"" + sourceNode + "\"]").select();
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
                }).selector('node[Type="GeneProduct"]').css({
                    'shape': 'rectangle',
                    'width': 'data(Width)',
                    'height': 'data(Height)',
                    'text-valign': 'middle',
                    'background-color': 'white',
                    'border-color': 'black',
                    'border-width': 1
                }).selector('node[Type="Protein"]').css({
                    'shape': 'rectangle',
                    'width': 'data(Width)',
                    'height': 'data(Height)',
                    'background-color': 'white',
                    'color': '#ff3333',
                    'border-color': '#ff3333',
                    'border-style': 'solid',
                    'border-width': 1
                }).selector('node[Type="unknown"]').css({
                    'shape': 'rectangle',
                    'background-color': 'white',
                    'color': 'white',
                    'border-color': 'black',
                    'border-style': 'solid',
                    'border-width': 1
                }).selector('node[Type="bundle_type_1"]').css({
                    'shape': 'rectangle',
                    'background-color': 'white',
                    'color': 'white',
                    'border-color': 'black',
                    'border-style': 'solid',
                    'border-width': 1
                }).selector('node[Type="bundle_type_2"]').css({
                    'shape': 'roundrectangle',
                    'background-color': 'white',
                    'color': 'white',
                    'border-color': 'black',
                    'border-style': 'solid',
                    'border-width': 1
                }).selector('node[Shape="Brace"]').css({
                    'shape': 'rectangle',
                    'width': '1',
                    'height': 'data(Width)',
                    'background-color': 'black',
                    'color': 'black',
                    'border-color': 'black',
                    'border-style': 'solid',
                    'border-width': 1
                }).selector('node[FillColor="ffffff"]').css({
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
                }).selector('edge[LineStyle="Dashed"]').css({
                    'line-style': 'dashed',
                    'line-color': 'black',
                    'background-color': 'black',
                    'color': 'black'
                }).selector('edge[EndArrow="Arrow"]').css({
                    'target-arrow-shape': 'triangle',
                    'target-arrow-color': 'black',
                    'target-arrow-fill': 'filled'
                }).selector('edge[EndArrow="TBar"]').css({
                    'target-arrow-shape': 'tee',
                    'target-arrow-color': 'black',
                    'target-arrow-fill': 'filled'
                }).selector('edge[ConnectorType="Elbow"]').css({
                    'line-color': 'yellow',
                    'line-style': 'solid'
                })

                        // node & edge elements (selected state)
                        .selector('edge:selected').css({
                    'background-color': 'green',
                    'line-color': 'green',
                    'target-arrow-color': 'green',
                    'source-arrow-color': 'green'
                }).selector('node:selected').css({
                    'background-color': 'green'
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
                }).selector('.red_bg').css({
                    'background-color': 'LightSalmon',
                    'color': 'black'
                }).selector('.purple_border').css({
                    'border-color': 'MediumPurple',
                    'border-width': 3
                }).selector('.red_border').css({
                    'border-color': 'red',
                    'border-width': 3
                }).selector('.red_shadow').css({
                    'shadow-opacity': 1,
                    'shadow-color': 'red',
                    'border-width': 1
                }).selector('.no_shadow').css({
                    'shadow-opacity': 0,
                    'shadow-color': 'red',
                    'border-width': 1
                }).selector('.red_circle').css({
                    'background-color': 'red',
                    'shape': 'ellipse',
                    'background-opacity': 0.5
                }).selector('.green_circle').css({
                    'background-color': 'green',
                    'shape': 'ellipse',
                    'background-opacity': 0.5
                }).selector('.reset_all').css({
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

                    // add custom event
                    var cy = $('#' + parent + '-cy').cytoscape('get');
                    var tappedBefore = null;
                    cy.on('tap', function (event) {
                        var tappedNow = event.cyTarget;
                        setTimeout(function () {
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
                    cy.on('click', 'node', function (event) {
                        if (orderedSelectedNodes.length < 2)
                            orderedSelectedNodes.push(event.cyTarget);
                        else
                            orderedSelectedNodes.shift();
                        orderedSelectedNodes.push(event.cyTarget);
                    });

                    cy.on('doubleTap', 'node', function (event) {
                        target = event.cyTarget;
                        dialogNode.dialog("open");
                    });

                    cy.on('doubleTap', 'edge', function (event) {
                        target = event.cyTarget;
                        dialogEdge.dialog("open");
                    });

                    cy.on('select', 'node', function (event) {
                        selectedForEditNodes = cy.$('node:selected');
                        //			    	saveState();
                    });

                    cy.on('unselect', 'node', function (event) {
                        selectedForEditNodes = cy.$('node:selected');
                        //			    	saveState();
                    });

                    cy.on('select', 'edge', function (event) {
                        selectedForEditEdges = cy.$('edge:selected');
                        //			    	saveState();
                    });

                    cy.on('unselect', 'edge', function (event) {
                        selectedForEditEdges = cy.$('edge:selected');
                        //			    	saveState();
                    });

                    cy.on('free', 'node', function (event) {
                        saveState();
                    });

                    cy.on('data', 'node', function (event) {
                        //					saveState();
                    });

                    cy.on('style', 'node', function (event) {
                        //					saveState();
                    });

                    saveState();
                },
                // initial viewport state:
                zoom: 1,
                pan: {
                    x: 0,
                    y: 0
                },
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
                initrender: function (evt) {/* ... */
                },
                renderer: {/* ... */}
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
                target.addClass(background);
            }
            if (border != '') {
                target.removeClass('purple_border');
                target.removeClass('red_border');
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
                    group: "edges",
                    data: {
                        id: target.data('id'),
                        LineThickness: target.data('LineThickness'),
                        EndArrow: target.data('EndArrow'),
                        Coords: target.data('Coords'),
                        ZOrder: target.data('ZOrder'),
                        source: target.data('target'),
                        target: target.data('source'),
                        StartArrow: target.data('StartArrow'),
                        selected: target.data('Selected')
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
            target.data('name', name);
            target.data('Width', width);
            target.data('Height', height);

            var node_name = target.data("name");
            selectedForQueryNodes.push(node_name);
            var node_id = target.data("id");
            var rna = document.getElementById(parent + "-rna").value;
            var cnv = document.getElementById(parent + "-cnv").value;
            var mut = document.getElementById(parent + "-mut").value;

            // RNA
            if (rna > 5) {
                setNodeStyle(target, 'red_bg', '', '');
            } else {
                setNodeStyle(target, 'green_bg', '', '');
            }

            if (cnv > 5) {
                setNodeStyle(target, '', 'red_border', '');
            } else {
                setNodeStyle(target, '', 'purple_border', '');
            }

            if (mut > 5) {
                setNodeStyle(target, '', '', 'red_shadow');
            } else {
                setNodeStyle(target, '', '', 'no_shadow');
            }


            coloredNodes.push({"gene_name": node_name, "rna": rna, "cnv": cnv, "mut": mut});
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

        function findObject(event) {
            console.log(coloredNodes);
            var val = event.target.value;
            $.post(services['objectfinder'], {
                pattern: JSON.stringify(coloredNodes)
            }, function (data) {
            	document.getElementById(parent + "-dialog-table").innerHTML = data;
            	dialogTable.dialog("open")
                console.log(data);
            });

        }
        
        dialogTable = $("#" + parent + "-dialog-table").dialog({
            autoOpen: false,
            height: 300,
            width: 350,
            buttons: {
                Cancel: function () {
                    dialogTable.dialog("close");
                }
            },
            close: function () {
            }
        });

        dialogNode = $("#" + parent + "-dialog-form-node").dialog({
            open: function (event) {
                document.getElementById(parent + "-gene-name").value = target.data('name');
            },
            autoOpen: false,
            height: 300,
            width: 350,
            buttons: {
                "submit": editNode,
                Cancel: function () {
                    dialogNode.dialog("close");
                }
            },
            close: function () {
            }
        });

        dialogEdge = $("#" + parent + "-dialog-form-edge").dialog({
            autoOpen: false,
            height: 300,
            width: 350,
            buttons: {
                "submit": editEdge,
                Cancel: function () {
                    dialogEdge.dialog("close");
                }
            },
            close: function () {
            }
        });

        dialogPathfind = $("#" + parent + "-dialog-form-find-path").dialog({
            open: function (event) {
                document.getElementById(parent + "-sid").value = orderedSelectedNodes[0]._private.data['name'];
                document.getElementById(parent + "-vid").value = orderedSelectedNodes[1]._private.data['name'];
            },
            autoOpen: false,
            height: 300,
            width: 350,
            buttons: {
                "submit": wrapperFindPath,
                Cancel: function () {
                    dialogPathfind.dialog("close");
                }
            },
            close: function () {
            }
        });

        dialogBundle = $("#" + parent + "-dialog-bundle").dialog({
            autoOpen: false,
            height: 300,
            width: 350,
            buttons: {
                "submit": bundle,
                Cancel: function () {
                    dialogPathfind.dialog("close");
                }
            },
            close: function () {
            }
        });

        var select = document.getElementById(parent + "-pathwaySelector");

        $.get(services['pathwayfinder'], {
            pathwayList: '1'
        }, function (data) {
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

        document.getElementById(parent + '-file').addEventListener('change', onChange);
        document.getElementById(parent + '-findPath').addEventListener('click', dialogPathfindOpen);
        document.getElementById(parent + '-findObject').addEventListener('click', findObject);
        document.getElementById(parent + '-deleteNodes').addEventListener('click', removeNodes);
        document.getElementById(parent + '-pathwaySelector').addEventListener('change', onSelect);
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
