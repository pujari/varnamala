/**
 * Describe a line between 2 points
 */
function describeLine(startX, startY, endX, endY) {
	return "M" + [ startX, startY ] + "L" + [ endX, endY ];
}

/**
 * Describe a line between center of a circle and a point on the perimeter at an
 * angle
 */
function describeRadialLine(startX, startY, radius, angle) {
	return "M"
			+ [ startX, startY ]
			+ "L"
			+ [ startX + radius * Math.cos(Snap.rad(angle)),
					startY - radius * Math.sin(Snap.rad(angle)) ];
}

/**
 * Describe a line between center of a circle and a point on the perimeter at an
 * angle
 */
function describePartialRadialLine(startX, startY, radius1, radius2, angle) {
	return "M"
			+ [ startX + radius1 * Math.cos(Snap.rad(angle)),
					startY - radius1 * Math.sin(Snap.rad(angle)) ]
			+ "L"
			+ [ startX + radius2 * Math.cos(Snap.rad(angle)),
					startY - radius2 * Math.sin(Snap.rad(angle)) ];
}

/**
 * Transform polar coordinates into cartesian
 */
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
	var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
	return {
		x : centerX + (radius * Math.cos(angleInRadians)),
		y : centerY + (radius * Math.sin(angleInRadians))
	};
}

/**
 * Describe an arc hinged on a given radius and angular range. To invert text
 * swap input startAngle with endAngle and flip the value after arcSweep from 0
 * to 1.
 */
function describeArc(xArc, yArc, radius, startAngle, endAngle, invert) {
	var start = polarToCartesian(xArc, yArc, radius, startAngle);
	var end = polarToCartesian(xArc, yArc, radius, endAngle);

	var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

	var d = [ "M", start.x, start.y, "A", radius, radius, 0, arcSweep,
			invert ? 0 : 1, end.x, end.y ].join(" ");
	return d;
}

/**
 * Scale linearly a value over a range until a maximum.
 */
function scale(value, max, range) {
	if (value < max && value != 0)
		value = range * value / max;
	else
		value = range;
	return value;
}

/**
 * Returns all levels
 */
function allLevels() {
	return Array('lowest', 'lower', 'average', 'higher', 'highest');
}

/**
 * Returns level
 */
function getLevel(val) {
	var levels = allLevels();
	// @TODO returning random category for now
	return levels[Math.floor(Math.random() * levels.length)];
}

/**
 * Draws bar charts. 2 bars values starting at point(x,y) and lengths val1, val2
 */
function drawBarChart(s, x, y, val1, val2, width, height) {
	var barclass = getLevel(val1);
	if (width == undefined || width == null)
		var width = 50;
	if (height == undefined || width == null)
		var height = 40;
	var hasUpside = (val1 >= val2);
	var bar1 = s.group(), bar2 = s.group();
	var sval1 = scale(val1, Math.max(val1, val2), height);
	var sval2 = scale(val2, Math.max(val1, val2), height);

	bar1.add(s.rect(x, y, width, sval1).animate({
		transform : 't0,' + Math.abs(height - sval1)
	}, 1000));
	bar1.addClass(barclass);
	// bar2
	bar2.add(s.rect(x + width + 5, y, width, sval2).animate({
		transform : 't0,' + Math.abs(height - sval2)
	}, 1000));
	bar2.addClass('neutral');
	return [ bar1, bar2, barclass ];
}

function drawBarChartText(s, x, y, val1, val2, width, height) {

	var bars = drawBarChart(s, x, y, val1, val2, width, height);
	// bar1
	bars[0].add(s.text(x + width / 4, y + height + 14, val1).addClass(
			'barLabel'));
	bars[0].addClass(bars[2]);
	bars[1].add(s.text(x + width / 4 + width + 5, y + height + 14, val2)
			.addClass('barLabel'));
	bars[1].addClass('neutral');

	return [ bars[0], bars[1], bars.barclass ];
}

function drawChartArrow(s, x, y, val1, val2, width, height, istext, isarrow,
		val3, val4) {
	var bar1arrow, bar2arrow
	bar1arrow = (val1 >= val3)
	bar2arrow = (val2 >= val4)

	var bars = drawBarChart(s, x, y, val1, val2, width, height);
	if (bar1arrow)
		bars[0].add(drawArrow(s, x + width / 4, y + height + 14, width / 2,
				height).addClass(bars[2]));
	else
		bars[0].add(drawArrow(s, x + width / 4, y + height + 14, width / 2,
				height).transform('r180').addClass(bars[2]));

	if (bar2arrow)
		bars[1].add(drawArrow(s, x + width / 4 + width + 5, y + height + 14,
				width / 2, height).addClass('neutral'));
	else
		bars[1].add(drawArrow(s, x + width / 4 + width + 5, y + height + 14,
				width / 2, height).transform('r180').addClass('neutral'));

	return [ bars[0], bars[1], bars.barclass ];

}
/**
 * Draws arrow
 */
function drawArrow(s, x, y, width, height) {
	return s.polyline([ x, y, x + width, y, x + width, y + height,
			x + width + 50, y + height, x + width / 2, y + height + 50, x - 50,
			y + height, x, y + height ]);
}

function drawLine(s, x1, y1, x2, y2, color, strokeWidth) {
	return s.line(x1, y1, x2, y2).attr({
		stroke : color,
		"stroke-width" : strokeWidth
	}); // adding attr not sure right approach or use class
}

/**
 * Drag functions
 */
var move = function (dx, dy, x, y) {
    var clientX, clientY;
    if ((typeof dx == 'object') && (dx.type == 'touchmove')) {
        clientX = dx.changedTouches[0].clientX;
        dx = clientX - this.data('ox');
    }
    this.attr({
        transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, 0]
    });
}

var start = function (x, y, ev) {
    if ((typeof x == 'object') && (x.type == 'touchstart')) {
        x.preventDefault();
        this.data('ox', x.changedTouches[0].clientX);
    }
    this.data('origTransform', this.transform().local);
}

var stop = function () {
}

