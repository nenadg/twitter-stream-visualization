var helpers = (function(){
	var lastXY;

	var formatLocation = function(p, k) {

		var format = d3.format("." + Math.floor(Math.log(k) / .2 - .2) + "f"), straight = [];

		if(p[1] < 0){
			straight.push((-format(-p[1])).toString());
		}

		if(p[1]> 1){
			straight.push(format(p[1]));
		}

		if(p[0] < 0){
			straight.push((-format(-p[0])).toString());
		}

		if(p[0] > 0){
			straight.push(format(p[0]));
		}

		var nice = (p[1] < 0 ? format(-p[1]) + "°S" : format(p[1]) + "°N") + " "
		+ (p[0] < 0 ? format(-p[0]) + "°W" : format(p[0]) + "°E");

		return { nice: ((p[1] < 0 ? format(-p[1]) + "°S" : format(p[1]) + "°N") + " "
			+ (p[0] < 0 ? format(-p[0]) + "°W" : format(p[0]) + "°E")), straight: straight };
	};

	var formatTipPosition = function(tipSelector, pointSelector, offset, useMouseLocation){
		var tip = d3.select(tipSelector),
			lastPoint = d3.selectAll(pointSelector),
			lastPoint = lastPoint? lastPoint[0][lastPoint[0].length - 1]: null;
			lastPointBB = lastPoint? lastPoint.getBoundingClientRect(): lastXY? { left: lastXY[0], top: lastXY[1] }: null;

		if(useMouseLocation){
			//var fi = formatLocation(projection.invert([mousepos.x, mousepos.y]), zoom.scale());
			tip.style("top", (mousepos.y + offset[0]) + "px");
			tip.style("left", (mousepos.x + offset[1]) + "px");

		} else {
			// offset - [top,left,bottom,right]
			if(lastPointBB){

				if(offset[0] != 0)
					tip.style("top", (lastPointBB.top + offset[0]) + "px");
				if(offset[1] != 0)
					tip.style("left", (lastPointBB.left + offset[1]) + "px");
				if(offset[2] != 0)
					tip.style("bottom", (lastPointBB.bottom - offset[2]) + "px")
				if(offset[3] != 0)
					tip.style("right", (lastPointBB.right - offset[3]) + "px");
			}
		}
	};

	var formatLabels = function(svg, path, projection, cityOpacity, startLongitude){

		svg.selectAll('.labels')
			//.attr('d', path.pointRadius(3))
			.attr('transform', function(d) {
				return 'translate(' + projection(d.geometry.coordinates) + ')';
			})
			.attr('style', 'font-size: 8px; opacity:' + cityOpacity + ' !important')
			.text(function(d) {
				return decodeURI(d.properties.city);
			})
			.attr('class', 'labels')
			.attr("mask", function (d) {
				// make the range from 0 to 360, so that it's easier to compare
				var longitude = Number(d.geometry.coordinates[0]) + 180;
				// +270 => -90 => the position of the left edge when the center is at 0
				// -value because a rotation to the right => left edge longitude is reducing
				// 360 because we want the range from 0 to 360
				//var startLongitude = 360 - ((projection.rotate()[0] + 270) % 360);
				// the right edge is start edge + 180
				var endLongitude = (startLongitude + 180) % 360;
				if ((startLongitude < endLongitude && longitude > startLongitude && longitude < endLongitude) ||
					// wrap around
					(startLongitude > endLongitude && (longitude > startLongitude || longitude < endLongitude)))
						return null;
				else
					return "url(#edge)";
			});
	};

	var tooltip = function(){

		d3.select('.tooltip').remove();

		var div = d3.select("body").append("div")
				.attr("class", "tooltip")
				.style("opacity", 0);
	};

	var locationtip = function(){

		d3.select('.locationtip').remove();

		var div = d3.select("body").append("div")
				.attr("class", "locationtip")
				.style("opacity", 0);
	};

	var totalstatustip = function(){

		d3.select('.totalstatustip').remove();

		var div = d3.select("body").append("div")
				.attr("class", "totalstatustip")
				.style("opacity", 0);
	};

	var prefixMatch = function(p) {

		var i = -1, n = p.length, s = document.body.style;
		while (++i < n) if (p[i] + "Transform" in s) return "-" + p[i].toLowerCase() + "-";
		return "";
	};

	var loadScript = function(file, type, callback) {
		var head = document.getElementsByTagName('head')[0], 
			script = document.createElement('script');

		script.type = type || 'text/javascript';
		script.src = file;
		head.appendChild(script);

		var loadtimeout = setTimeout(function(){
			callback();
			clearTimeout(loadtimeout);
		}, 120);
	};

	return {
		formatLocation: formatLocation,
		formatTipPosition: formatTipPosition,
		formatLabels: formatLabels,
		tooltip: tooltip,
		locationtip: locationtip,
		totalstatustip: totalstatustip,
		prefixMatch: prefixMatch,
		loadScript: loadScript
	};

})();