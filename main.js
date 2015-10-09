VQI_pathwayEditor.prototype = new VQI_Observable();

var services = [];
services['pathwayfinder'] = 'http://137.99.11.36/pathwayVisual/PathwayParser/ajaxJSON.php';
var VQI_pathwayEditor = new VQI_pathwayEditor("parent",services);
VQI_pathwayEditor.subscribeTo(VQI_pathwayEditor);