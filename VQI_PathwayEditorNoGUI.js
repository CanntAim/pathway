var VQI_PathwayEditorNoGUI = function () {
	self = this;
	
	function preAddProcessing(obj) {
        for (var i = 0; i < obj.elements.nodes.length; i++) {
            if (obj.elements.nodes[i].data.id.substring(0, 1) == "n") {
                var number = parseInt(obj.elements.nodes[i].data.id.substring(1, obj.elements.nodes.length - 1));
                if (number > nodeCounter)
                    nodeCounter = number + 1;
            }

            if (typeof (obj.elements.nodes[i].data.backgroundImage) == "undefined") {
                obj.elements.nodes[i].data.backgroundImage = "";
            }

            if (typeof (obj.elements.nodes[i].data.zIndex) == "undefined") {
                obj.elements.nodes[i].data.zIndex = 0;
            }

            if (types.indexOf(obj.elements.nodes[i].data.Type) == -1) {
                obj.elements.nodes[i].data.Type = "label";
            }

            if (typeof (obj.elements.nodes[i].data.rna) == "undefined") {
                obj.elements.nodes[i].data.rna = 0;
            }

            if (typeof (obj.elements.nodes[i].data.cnv) == "undefined") {
                obj.elements.nodes[i].data.cnv = 0;
            }

            if (typeof (obj.elements.nodes[i].data.mut) == "undefined") {
                obj.elements.nodes[i].data.mut = 0;
            }

            if (obj.elements.nodes[i].data.Type == "gene") {
                obj.elements.nodes[i].data.Height = 20;
                obj.elements.nodes[i].data.Width = 50;
            }
        }

        for (var i = 0; i < obj.elements.edges.length; i++) {
            if (obj.elements.edges[i].data.id.substring(0, 1) == "e") {
                var number = parseInt(obj.elements.edges[i].data.id.substring(1, obj.elements.edges.length - 1));
                if (number > edgeCounter)
                    edgeCounter = number + 1;
            }
        }
    }
		
	function sprayColorNoGUI(lines, obj) {
        var lookup = {};
        for (var i = 0, len = obj.elements.nodes.length; i < len; i++) {
            if (typeof (lookup[obj.elements.nodes[i].data.name]) != "undefined")
                lookup[obj.elements.nodes[i].data.name].push(obj.elements.nodes[i].data);
            else
                lookup[obj.elements.nodes[i].data.name] = [obj.elements.nodes[i].data];
        }

        var header = {};
        for (var i = 0; i < lines[0].length; i++) {
            var value = lines[0][i].toLowerCase().trim();
            header[value] = i;
        }

        for (var line = 1; line < lines.length; line++) {
            var target = lines[line][header["gene"]];
            if (typeof (lookup[target]) != "undefined") {
                for (entry in lookup[target]) {
                    if (typeof (header["mut"]) != "undefined") {
                        mut = lines[line][header["mut"]];
                        if (!isNaN(mut))
                            lookup[target][entry].mut = mut;
                        else
                            lookup[target][entry].mut = "0";
                    }
                    if (typeof (header["cnv"]) != "undefined") {
                        cnv = lines[line][header["cnv"]];
                        if (!isNaN(cnv))
                            lookup[target][entry].cnv = cnv;
                        else
                            lookup[target][entry].cnv = "0";
                        }
                    if (typeof (header["rna"]) != "undefined") {
                        rna = lines[line][header["rna"]];
                        if (!isNaN(rna))
                            lookup[target][entry].rna = rna;
                        else
                            lookup[target][entry].rna = "0";
                    }
                }
            }
        }
    }
	
	function setElementsNoGUI(obj) {
        preAddProcessing(obj);
    }
		
	self.printGraphExternalNoGUI = function () {
        console.log(self.json);
    }

    self.produceJSONExternalNoGUI = function () {
        download(JSON.stringify(self.json), "data.txt", "text/plain");
    }

    self.sprayColorExternalNoGUI = function (list) {
        sprayColorNoGUI(list, self.json);
    }

    self.loadPathwayExternalNoGUI = function (id) {
        $.post(services['pathwayFinder'], {
            pid: id
        }, function (data) {
            self.json = JSON.parse(data);
            setElementsNoGUI(self.json);
        });
    }
}