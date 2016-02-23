var VQI_PathwayEditorNoGUI = function () {
    self = this;
    var definitionHub = {}

    definitionHub.nodeTypes = {nType1: ["bundleone", "ntype1"], nType2: ["bundletwo", "ntype2"], nType3: ["gene", "ntype3"], nType4: ["geneproduct", "ntype4"], nType5: ["protein", "ntype5"],
        nType6: ["rna", "ntype6"], nType7: ["microrna", "ntype7"], nType8: ["kinase", "ntype8"], nType9: ["ligand", "ntype9"], nType10: ["receptor", "ntype10"], nType11: ["biologicalprocess", "ntype11"],
        nType12: ["triangle", "ntype12"], nType13: ["rectangle", "ntype13"], nType14: ["circle", "ntype14"], nType15: ["ellipse", "ntype15"], nType16: ["pentagon", "ntype16"], nType17: ["hexagon", "ntype17"],
        nType18: ["heptagon", "ntype18"], nType19: ["octagon", "ntype19"], nType20: ["star", "ntype20"], nType21: ["diamond", "ntype21"], nType22: ["vee", "ntype22"], nType23: ["rhomboid", "ntype23"], nType24: ["label", "ntype24"], nType25: ["transcriptionfactor", "ntype25"]};

    definitionHub.edgeLineTypes = {elType1: ["solid", "eltype1"], elType2: ["dashed", "eltype2"], elType3: ["dotted", "eltype3"]};
    definitionHub.arrowLineTypes = {
        alType1: ["line", "altype1", "1", "rType1"]
        , alType2: ["activate", "altype2", "2", "rType2"]
        , alType3: ["inhibit", "tbar", "altype3", "3", "rType3"]
        , alType4: ["regulate", "altype4", "4", "rType4"]};
    var services = {};
    services = web_services['VQI_PATHWAY_EDITOR'];
//    services["pathwayFinderUrl"] = "http://bibci.engr.uconn.edu/puj07001/pathway_services/find_path_and_score/find_path_and_score.php";
//    services['pathwayFinder'] = 'http://bibci.engr.uconn.edu/pathwayVisual/PathwayParser/ajaxJSON.php';

    var nodeCounter = 0;
    var edgeCounter = 0;

    function mapReverseDictionary() {
        var reverseLookup = {};
        for (var i in definitionHub.nodeTypes) {
            for (var j = 0, innerLen = definitionHub.nodeTypes[i].length; j < innerLen; j++) {
                reverseLookup[definitionHub.nodeTypes[i][j].toLowerCase()] = i;
            }
        }
        for (var i in definitionHub.arrowLineTypes) {
            for (var j = 0, innerLen = definitionHub.arrowLineTypes[i].length; j < innerLen; j++) {
                reverseLookup[definitionHub.arrowLineTypes[i][j].toLowerCase()] = i;
            }
        }
        for (var i in definitionHub.edgeLineTypes) {
            for (var j = 0, innerLen = definitionHub.edgeLineTypes[i].length; j < innerLen; j++) {
                reverseLookup[definitionHub.edgeLineTypes[i][j].toLowerCase()] = i;
            }
        }
        return reverseLookup;
    }

    function preAddProcessing(obj) {
        var reverseLookup = mapReverseDictionary();

        for (var i = 0; i < obj.elements.nodes.length; i++) {
            if (obj.elements.nodes[i].data.id.substring(0, 1) == "n") {
                var number = parseInt(obj.elements.nodes[i].data.id.substring(1, obj.elements.nodes.length - 1));
                if (number > nodeCounter)
                    nodeCounter = number + 1;
            }

            if (typeof (obj.elements.nodes[i].data.BackgroundImage) == "undefined") {
                obj.elements.nodes[i].data.BackgroundImage = "";
            }

            if (typeof (obj.elements.nodes[i].data.ZIndex) == "undefined") {
                obj.elements.nodes[i].data.ZIndex = 0;
            }

            if (typeof (obj.elements.nodes[i].data.Type) == "undefined" || typeof (reverseLookup[obj.elements.nodes[i].data.Type.toLowerCase()]) == "undefined") {
                obj.elements.nodes[i].data.Type = "nType15";
            } else {
                obj.elements.nodes[i].data.Type = reverseLookup[obj.elements.nodes[i].data.Type.toLowerCase()];
            }

            if (typeof (obj.elements.nodes[i].data.Rna) == "undefined" || isNaN(obj.elements.nodes[i].data.Rna)) {
                obj.elements.nodes[i].data.Rna = 0;
            }

            if (typeof (obj.elements.nodes[i].data.Cnv) == "undefined" || isNaN(obj.elements.nodes[i].data.Cnv)) {
                obj.elements.nodes[i].data.Cnv = 0;
            }

            if (typeof (obj.elements.nodes[i].data.Mut) == "undefined" || isNaN(obj.elements.nodes[i].data.Mut)) {
                obj.elements.nodes[i].data.Mut = 0;
            }

            if (typeof (obj.elements.nodes[i].data.oldPositionX) == "undefined" || isNaN(obj.elements.nodes[i].data.oldPositionX)) {
                obj.elements.nodes[i].data.oldPositionX = 0;
            }

            if (typeof (obj.elements.nodes[i].data.oldPositionY) == "undefined" || isNaN(obj.elements.nodes[i].data.oldPositionY)) {
                obj.elements.nodes[i].data.oldPositionY = 0;
            }

            if (typeof (obj.elements.nodes[i].data.Width) == "undefined" || isNaN(obj.elements.nodes[i].data.Width)) {
                obj.elements.nodes[i].data.Width = 50;
            }

            if (typeof (obj.elements.nodes[i].data.Height) == "undefined" || isNaN(obj.elements.nodes[i].data.Height)) {
                obj.elements.nodes[i].data.Height = 30;
            }
        }

        for (var i = 0; i < obj.elements.edges.length; i++) {
            if (obj.elements.edges[i].data.id.substring(0, 1) == "e") {
                var number = parseInt(obj.elements.edges[i].data.id.substring(1, obj.elements.edges.length - 1));
                if (number > edgeCounter)
                    edgeCounter = number + 1;
            }

            if (typeof (obj.elements.edges[i].data.Type) == "undefined" || typeof (reverseLookup[obj.elements.edges[i].data.Type.toLowerCase()]) == "undefined") {
                obj.elements.edges[i].data.Type = "elType1";
            } else {
                obj.elements.edges[i].data.Type = reverseLookup[obj.elements.edges[i].data.Type.toLowerCase()];
            }

            if (typeof (obj.elements.edges[i].data.EndArrow) == "undefined" || typeof (reverseLookup[obj.elements.edges[i].data.EndArrow.toLowerCase()]) == "undefined") {
                obj.elements.edges[i].data.EndArrow = "alType1";
            } else {
                obj.elements.edges[i].data.EndArrow = reverseLookup[obj.elements.edges[i].data.EndArrow.toLowerCase()];
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
					if (typeof (header["p"]) != "undefined") {
                        p = lines[line][header["p"]];
                        if (!isNaN(p))
                            lookup[target][entry].p = p;
                        else
                            lookup[target][entry].p = "0";
                    }
                    if (typeof (header["m"]) != "undefined") {
                        m = lines[line][header["m"]];
                        if (!isNaN(m))
                            lookup[target][entry].m = m;
                        else
                            lookup[target][entry].m = "0";
                    }
                    if (typeof (header["pa"]) != "undefined") {
                        pa = lines[line][header["pa"]];
                        if (!isNaN(pa))
                            lookup[target][entry].pa = pa;
                        else
                            lookup[target][entry].pa = "0";
                    }
                }
            }
        }
    }

    function setElementsNoGUI(obj) {
        preAddProcessing(obj);
    }

    function defineNoGUI(key) {
        var definition = "";
        for (var i in definitionHub.nodeTypes) {
            if (i == key)
                definition = definitionHub.nodeTypes[i][0];
        }
        for (var i in definitionHub.arrowLineTypes) {
            if (i == key)
                definition = definitionHub.arrowLineTypes[i][0];

        }
        for (var i in definitionHub.edgeLineTypes) {
            if (i == key)
                definition = definitionHub.edgeLineTypes[i][0];
        }
        return definition;
    }

    function mapForExportNoGUI(obj) {
        for (var i = 0; i < obj.elements.nodes.length - 1; i++) {
            obj.elements.nodes[i].data.Type = defineNoGUI(obj.elements.nodes[i].data.Type);
        }
        for (var i = 0; i < obj.elements.edges.length - 1; i++) {
            obj.elements.edges[i].data.Type = defineNoGUI(obj.elements.edges[i].data.Type);
            obj.elements.edges[i].data.EndArrow = defineNoGUI(obj.elements.edges[i].data.EndArrow);
        }
    }

    self.printGraphExternalNoGUI = function () {
        console.log(self.json);
    }

    self.produceJSONExternalNoGUI = function () {
        mapForExportNoGUI(self.json)
        download(JSON.stringify(self.json), "data.txt", "text/plain");
    }

    self.setPersonIdNoGUI = function (id) {
        self.personId = id;
    }

    self.getPersonIdNoGUI = function () {
        return self.personId;
    }

    self.sprayColorExternalNoGUI = function (list) {
        sprayColorNoGUI(list, self.json);
    }

    self.getJSON = function () {
        return JSON.stringify(self.json);
    }

    self.loadPathwayExternalNoGUI = function (id, f) {
        var callback = f || null;
        $.post(services['pathwayFinder'], {
            pid: id
        }, function (data) {
            self.json = JSON.parse(data);
            setElementsNoGUI(self.json);
            if (callback !== null) {
                callback();
            }
        });
    }

    self.findPathExternalNoGUI = function (sid, vid, f) {
        var callback = f || null;
        mapForExportNoGUI(self.json);
        $.post(services['pathwayFinderUrl'], {
            s: sid,
            d: vid,
            json: JSON.stringify(self.json),
            p: self.personId
        }, function (yue_data) {
            var result = JSON.parse(yue_data);
//            console.log(result);
            if (callback !== null) {
                callback(result);
            }
            return result;
        })
    }
}