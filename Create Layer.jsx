{
    function createLayerPlugin(thisObj) {
        function buildUI(thisObj) {
            var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Create Layers", undefined, {resizeable: true});
            
            myPanel.orientation = "column";
            myPanel.alignChildren = ["center", "top"];
            myPanel.spacing = 10;
            myPanel.margins = 10;

            var header = myPanel.add("statictext", undefined, "Create Layers");
            header.alignment = "center";
            header.graphics.font = ScriptUI.newFont("Tahoma", "BOLD", 20);
            header.graphics.foregroundColor = header.graphics.newPen(header.graphics.PenType.SOLID_COLOR, [1, 1, 0, 1], 1);
            header.maximumSize.width = 300;  // Adjust width as needed to prevent line break

            var buttonGroup = myPanel.add("group");
            buttonGroup.orientation = "row";
            buttonGroup.alignChildren = ["center", "top"];
            buttonGroup.spacing = 10;

            var leftColumn = buttonGroup.add("group");
            leftColumn.orientation = "column";
            leftColumn.spacing = 10;

            var rightColumn = buttonGroup.add("group");
            rightColumn.orientation = "column";
            rightColumn.spacing = 10;

            // Helper function to create buttons
            function createStyledButton(name, parentGroup) {
                var btn = parentGroup.add("button", undefined, name);
                btn.graphics.foregroundColor = btn.graphics.newPen(btn.graphics.PenType.SOLID_COLOR, [1, 1, 0, 1], 1); // Yellow text
                btn.minimumSize = [200, 40];
                return btn;
            }

            var createTextLayerBtn = createStyledButton("Create Text Layer", leftColumn);
            var createSolidLayerBtn = createStyledButton("Create Solid Layer", rightColumn);
            var createLightLayerBtn = createStyledButton("Create Light Layer", leftColumn);
            var createCameraLayerBtn = createStyledButton("Create Camera Layer", rightColumn);
            var createNullLayerBtn = createStyledButton("Create Null Layer", leftColumn);
            var createShapeLayerBtn = createStyledButton("Create Shape Layer", rightColumn);
            var createAdjustmentLayerBtn = createStyledButton("Create Adjustment Layer", leftColumn);
            var createContentAwareFillLayerBtn = createStyledButton("Create Content Aware Fill Layer", rightColumn);

            function createLayer(layerType) {
                var comp = app.project.activeItem;
                if (!(comp instanceof CompItem)) {
                    alert("Please select a composition.");
                    return;
                }
                
                var selectedLayers = comp.selectedLayers;
                if (selectedLayers.length === 0) {
                    alert("Please select a layer in the timeline.");
                    return;
                }
                
                var baseLayer = selectedLayers[0];
                var newLayer;
                
                app.beginUndoGroup("Create " + layerType);
                
                switch (layerType) {
                    case "Text":
                        newLayer = comp.layers.addText("New Text");
                        break;
                    case "Solid":
                        newLayer = comp.layers.addSolid([1, 1, 1], "New Solid", baseLayer.width, baseLayer.height, comp.pixelAspect);
                        break;
                    case "Light":
                        newLayer = comp.layers.addLight("New Light", [comp.width / 2, comp.height / 2]);
                        break;
                    case "Camera":
                        newLayer = comp.layers.addCamera("New Camera", [comp.width / 2, comp.height / 2]);
                        break;
                    case "Null":
                        newLayer = comp.layers.addNull();
                        break;
                    case "Shape":
                        newLayer = comp.layers.addShape();
                        break;
                    case "Adjustment":
                        newLayer = comp.layers.addSolid([1, 1, 1], "New Adjustment", baseLayer.width, baseLayer.height, comp.pixelAspect);
                        newLayer.adjustmentLayer = true;
                        break;
                    case "Content Aware Fill":
                        // Add your own implementation here for Content Aware Fill
                        break;
                }
                
                if (newLayer) {
                    newLayer.startTime = baseLayer.startTime;
                    newLayer.inPoint = baseLayer.inPoint;
                    newLayer.outPoint = baseLayer.outPoint;
                    newLayer.moveBefore(baseLayer);
                }
                
                app.endUndoGroup();
            }
            
            createTextLayerBtn.onClick = function() { createLayer("Text"); };
            createSolidLayerBtn.onClick = function() { createLayer("Solid"); };
            createLightLayerBtn.onClick = function() { createLayer("Light"); };
            createCameraLayerBtn.onClick = function() { createLayer("Camera"); };
            createNullLayerBtn.onClick = function() { createLayer("Null"); };
            createShapeLayerBtn.onClick = function() { createLayer("Shape"); };
            createAdjustmentLayerBtn.onClick = function() { createLayer("Adjustment"); };
            createContentAwareFillLayerBtn.onClick = function() { createLayer("Content Aware Fill"); };
            
            return myPanel;
        }
        
        var myPanel = buildUI(thisObj);
        
        if (myPanel instanceof Window) {
            myPanel.center();
            myPanel.show();
        } else {
            myPanel.layout.layout(true);
            myPanel.layout.resize();
        }
    }
    
    createLayerPlugin(this);
}
