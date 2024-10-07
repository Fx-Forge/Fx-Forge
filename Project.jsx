function createCompPanel(thisObj) {
    // Function to build the UI
    function buildUI(thisObj) {
        var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Create and Open Composition", undefined, {resizeable:true});
        
        // UI elements
        myPanel.orientation = "column";
        
        // Add a group for composition name input
        var nameGroup = myPanel.add("group");
        nameGroup.add("statictext", undefined, "Comp Name:");
        var nameInput = nameGroup.add("edittext", undefined, "My Composition");
        nameInput.characters = 20;
        
        // Add a group for resolution selection
        var resolutionGroup = myPanel.add("group");
        resolutionGroup.add("statictext", undefined, "Resolution:");
        var resolutionDropdown = resolutionGroup.add("dropdownlist", undefined, ["1080p", "2K", "4K"]);
        resolutionDropdown.selection = 0;
        
        // Add a group for frame rate selection
        var frameRateGroup = myPanel.add("group");
        frameRateGroup.add("statictext", undefined, "Frame Rate:");
        var frameRateDropdown = frameRateGroup.add("dropdownlist", undefined, ["8", "12", "15", "24", "25", "30", "50", "60", "120"]);
        frameRateDropdown.selection = 0;
        
        // Add a group for duration input
        var durationGroup = myPanel.add("group");
        durationGroup.add("statictext", undefined, "Duration:");
        var durationInput = durationGroup.add("edittext", undefined, "0:00:10:00");
        durationInput.characters = 10;
        
        // Add a button group for actions (Create Composition and Open Composition)
        var actionGroup = myPanel.add("group");
        var createBtn = actionGroup.add("button", undefined, "Create Composition");
        var openBtn = actionGroup.add("button", undefined, "Open Composition");
        
        // Add a dropdown list for compositions
        var compGroup = myPanel.add("group");
        compGroup.add("statictext", undefined, "Open Comp:");
        var compDropdown = compGroup.add("dropdownlist", undefined, []);
        var refreshBtn = compGroup.add("button", undefined, "Refresh");
        
        // Function to parse timecode string into duration in seconds
        function parseTimecodeToSeconds(timecode) {
            var parts = timecode.split(":");
            var hours = parseInt(parts[0], 10);
            var minutes = parseInt(parts[1], 10);
            var seconds = parseInt(parts[2], 10);
            var frames = parseInt(parts[3], 10);
            
            var frameRate = parseInt(frameRateDropdown.selection.text);
        
            return (hours * 3600) + (minutes * 60) + seconds + (frames / frameRate);
        }
        
        // Function to update the dropdown list with all compositions
        function updateCompList() {
            compDropdown.removeAll();
            var proj = app.project;
            if (proj && proj.numItems > 0) {
                for (var i = 1; i <= proj.numItems; i++) {
                    var item = proj.item(i);
                    if (item instanceof CompItem) {
                        compDropdown.add("item", item.name);
                    }
                }
                if (compDropdown.items.length > 0) {
                    compDropdown.selection = 0; // Set default selection to the first item
                }
            }
        }
        
        // Function to assign colors based on layer type
        function assignLayerColors(comp) {
            var layers = comp.layers;
            var audioColors = [ [1.0, 0.0, 0.0], [1.0, 0.5, 0.0], [1.0, 1.0, 0.0], [0.5, 1.0, 0.0] ]; // Red shades
            var videoColors = [ [0.0, 1.0, 0.0], [0.0, 1.0, 1.0], [0.0, 0.0, 1.0], [1.0, 0.0, 1.0] ]; // Green shades
            var adjustmentColors = [ [0.5, 0.5, 0.5], [0.8, 0.8, 0.8], [0.2, 0.2, 0.2], [0.0, 0.0, 0.0] ]; // Grey shades
            
            for (var i = 1; i <= layers.length; i++) {
                var layer = layers[i];
                if (layer instanceof AVLayer) {
                    if (layer.hasAudio && layer.hasVideo) {
                        layer.label = 14; // Yellow color for layers with both audio and video
                    } else if (layer.hasAudio && !layer.hasVideo) {
                        layer.label = audioColors[i % audioColors.length]; // Assigning different shades of red for audio layers
                    } else if (!layer.hasAudio && layer.hasVideo) {
                        layer.label = videoColors[i % videoColors.length]; // Assigning different shades of green for video layers
                    }
                } else if (layer instanceof AdjustmentLayer || layer instanceof SolidSource) {
                    layer.label = adjustmentColors[i % adjustmentColors.length]; // Assigning different shades of grey for adjustment/solid layers
                }
            }
        }
        
        // Create Composition button click handler
        createBtn.onClick = function() {
            var proj = app.project;
            if (!proj) proj = app.newProject();
        
            var width, height, frameRate;
        
            switch (resolutionDropdown.selection.text) {
                case "1080p":
                    width = 1920;
                    height = 1080;
                    break;
                case "2K":
                    width = 2048;
                    height = 1080;
                    break;
                case "4K":
                    width = 3840;
                    height = 2160;
                    break;
            }
        
            frameRate = parseInt(frameRateDropdown.selection.text);
        
            var duration = parseTimecodeToSeconds(durationInput.text);
        
            var comp = proj.items.addComp(
                nameInput.text + " - " + resolutionDropdown.selection.text + " - " + frameRate + "fps",
                width,
                height,
                1.0,
                duration,
                frameRate
            );
        
            comp.openInViewer();
        
            alert("Composition created with resolution " + resolutionDropdown.selection.text + " and frame rate " + frameRate + "fps, duration " + durationInput.text + ".");
        
            assignLayerColors(comp); // Assign colors to layers
        
            updateCompList();
        };
        
        // Open Composition button click handler
        openBtn.onClick = function() {
            var selectedCompName = compDropdown.selection ? compDropdown.selection.text : null;
            if (selectedCompName) {
                var proj = app.project;
                if (proj && proj.numItems > 0) {
                    for (var i = 1; i <= proj.numItems; i++) {
                        var item = proj.item(i);
                        if (item instanceof CompItem && item.name === selectedCompName) {
                            item.openInViewer();
                            break;
                        }
                    }
                }
            }
        };
        
        // Refresh button click handler
        refreshBtn.onClick = function() {
            updateCompList();
        };
        
        // Initial update of the composition list
        updateCompList();
        
        return myPanel;
    }
    
    var myPanel = buildUI(thisObj);
    
    // Show the UI panel
    if (myPanel instanceof Window) {
        myPanel.center();
        myPanel.show();
    } else {
        myPanel.layout.layout(true);
        myPanel.layout.resize();
    }
}

// Run the function
createCompPanel(this);
