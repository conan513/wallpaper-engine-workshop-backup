window.wallpaperPropertyListener = {
	applyUserProperties: function(properties) {

        // Read scheme color
        if (properties.schemecolor) {
            // Convert the scheme color to be applied as a CSS style
            var schemeColor = properties.schemecolor.value.split(' ');
            schemeColor = schemeColor.map(function(c) {
                return Math.ceil(c * 255);
            });
            var schemeColorAsCSS = 'rgb(' + schemeColor + ')';
			$('body').css('background-color', schemeColorAsCSS);
        }

        // Read custom color
        if (properties.customcolor) {
            // Convert the custom color to be applied as a CSS style
            var customColor = properties.customcolor.value.split(' ');
            customColor = customColor.map(function(c) {
                return Math.ceil(c * 255);
            });
            var customColorAsCSS = 'rgb(' + customColor + ')';
			$('.customcolor').css('color', customColorAsCSS);
        }
		
		//Read background Image
		if (properties.image) {
                if (properties.image.value) {
                    // Create a valid location path
                    var imagePath = "file:///" + properties.image.value;

                    // Set is as the body background Image
                    document.body.style.backgroundImage = "url('" + imagePath + "')";
                } else {
                    // You may want to reset the background when the user clears the Image
                    document.body.style.backgroundImage = null;
                }
            }
		
		// Read custom boolean
        if (properties.custombool) {
            var EU = document.getElementById('timeEU');
			var NA = document.getElementById('timeNA');
			
            
            if (properties.custombool.value) {
                EU.style.visibility = "hidden";
				EU.style.position = "absolute";
				NA.style.position = "unset"
				NA.style.visibility = "visible"
            } else {
                NA.style.visibility = "hidden";
				NA.style.position = "absolute";
				EU.style.position = "unset"
				EU.style.visibility = "visible"
            }
        }
		
		 // Read custom slider
        if (properties.customint) {
			var EU = document.getElementById('timeEU');
			var NA = document.getElementById('timeNA');
            
            EU.style.fontSize = properties.customint.value + 'px';
			NA.style.fontSize = properties.customint.value + 'px';
        }
		
		// Read custom slider
        if (properties.customint2) {
           var date = document.getElementById('date');
		   
		   date.style.fontSize = properties.customint2.value + 'px';
        }
		
	}
};

