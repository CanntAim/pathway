pathwayEditor.prototype = new VQI_Observable();
var pathwayEditor = new pathwayEditor("parent");
pathwayEditor.subscribeTo(pathwayEditor);