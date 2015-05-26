/**
 * Directive that renders the Chakra component, handles associated events and user interaction.
 */
directives.directive("panchanga", function($rootScope){
	return {
		restrict: "A",
		link: function(scope, element){
			var s = Snap("#svg");
			var delta = 5; //tick angles
			var imgSet = Snap.set(), chartSet = Snap.set();
			var chakra = s.group(), labels = s.group(), categories = s.group(),  buttons = s.group();
			var centerLabel;

			// initial coordinates centered on viewbox
			var x = s.attr('viewBox').w/2, y = s.attr('viewBox').h/2;

			//initialize radius of circles relative to x,y
			var r = y/4.11, r2=r*2.2, r3=r*3.4, r4=r*3.7, r5=r*4, rT=r*3.8;

			var tabs = s.group();
			drawChakra();
			drawTabs();

			/**
			 * Draw tab selectors on the chakra chart
			 */
			function drawTabs(){
				var selectedTab;
				drawVarnamala();

				/**
				 * Handle tab click
				 */
				function clickHandler() {
					//check which tab was clicked
					var selectedIdx = this.data("index");

					if(centerLabel) centerLabel.remove();

					//rotate tabs
					tabs.animate({ 'transform' : 'r-' + delta*selectedIdx + ',' + x + ',' + y} ,1000, mina.easeout);

					//highlight selected tab
					this.toggleClass('inactiveLabel', false);
					if(selectedTab != null && selectedTab != this){
						selectedTab.toggleClass('inactiveLabel', true);
					}
					selectedTab = this;
					centerLabel = s.text(this.getBBox().x,this.getBBox().y, selectedIdx).addClass('centreLabel')
						.animate({transform:'t' + (x-this.getBBox().x - 20) + ',' + (y-this.getBBox().y + 15) + 's1.3' }, 1000, mina.easeinout);
				}

				/**
				 * Draw selectors
				 */
				function drawVarnamala(){
					var startAngle = -4;
					var endAngle = startAngle + delta;

					for(var i = 0; i< 360/delta; i++){
						var path = describeArc(x,y,rT, startAngle , endAngle);
						var label = s.text(0, y, i) //x=0 for curved text
							.attr({textpath: path, textanchor:'start'})
							.addClass('activeLabel inactiveLabel');

						//associate index
						label.data("index", i).click( clickHandler );
						tabs.add(label);

						startAngle = endAngle;
						endAngle = startAngle + delta;
					}
				}
			}

			/**
			 * Draw circles and radial lines on the chakra chart
			 */
			function drawChakra(){
				var rad0, rad1, rad2, path;

				//5th circle
				chakra.add(s.circle(x,y,r5).addClass('chakraBorder'));
				//4th circle
				chakra.add(s.circle(x,y,r).addClass('chakraBorder').animate({r:r4},1200));
				//3rd circle
				chakra.add(s.circle(x,y,r3).addClass('chakraLine'));
				//2nd circle
				chakra.add(s.circle(x,y,r2).addClass('chakraLine'));
				//inner circle
				chakra.add(s.circle(x,y,r).addClass('chakraInner'));

				//radial markers for varnamala
				for(var i=0;i<360/delta;i++){
					var rad = describePartialRadialLine(x, y, r4, r5, i*delta);
					chakra.add(s.path(rad).addClass('chakraLine'));
				}

				//click handler for chakra label
				var labelClickHandler = function () {
					$rootScope.$emit('navigate', this.data('target'));
				};

				//chakra label builder
				function curvedText(text,path, target) {
					return s.text(0, y, text).attr({textpath: path}).addClass('chakraLabel').data("target", target).click(labelClickHandler);
				};

				//chakra labels 1
				path = describeArc(x,y,r*3.85,-6,90);
				categories.add(s.path(path).attr({stroke:'red', strokeWidth: (r4-r3), fill:'none', opacity:0.2}));

				path = describeArc(x,y,r*3.55,-6,90);
				labels.add(curvedText("swara/vowels", path));

				path = describeArc(x,y,r*3.85,90,246);
				categories.add(s.path(path).attr({stroke:'green', strokeWidth: (r4-r3), fill:'none', opacity:0.2}));

				path = describeArc(x,y,r*3.55,90,246);
				labels.add(curvedText("vyanjana/consonants", path));

				path = describeArc(x,y,r*3.85,246,288);
				categories.add(s.path(path).attr({stroke:'grey', strokeWidth: (r4-r3), fill:'none', opacity:0.2}));

				path = describeArc(x,y,r*3.55,246,288);
				labels.add(curvedText("semi-vowels", path));

				path = describeArc(x,y,r*3.85,288,306);
				categories.add(s.path(path).attr({stroke:'magenta', strokeWidth: (r4-r3), fill:'none', opacity:0.2}));

				path = describeArc(x,y,r*3.55,288,306);
				labels.add(curvedText("hiss", path));

				path = describeArc(x,y,r*3.85,306,312);
				categories.add(s.path(path).attr({stroke:'grey', strokeWidth: (r4-r3), fill:'none', opacity:0.2}));

				path = describeArc(x,y,r*3.55,306,312);
				labels.add(curvedText("aspirate", path));

				path = describeArc(x,y,r*3.85,312,354);
				categories.add(s.path(path).attr({stroke:'cyan', strokeWidth: (r4-r3), fill:'none', opacity:0.2}));

				path = describeArc(x,y,r*3.55,312,354);
				labels.add(curvedText("maatra", path));


				//chakra labels 2
				path = describeArc(x,y,r*3.22,90,120);
				categories.add(s.path(path).attr({stroke:'yellow', strokeWidth: (r4-r3), fill:'none', opacity:0.2}));
				labels.add(curvedText("kanthya/guttural", path));

				path = describeArc(x,y,r*3.22,120,150);
				categories.add(s.path(path).attr({stroke:'blue', strokeWidth: (r4-r3), fill:'none', opacity:0.2}));
				labels.add(curvedText("taalavya/palatal", path));

				path = describeArc(x,y,r*3.22,150,180);
				categories.add(s.path(path).attr({stroke:'pink', strokeWidth: (r4-r3), fill:'none', opacity:0.2}));
				labels.add(curvedText("murdhanya/cerebral", path));

				path = describeArc(x,y,r*3.22,180,216);
				categories.add(s.path(path).attr({stroke:'orange', strokeWidth: (r4-r3), fill:'none', opacity:0.2}));
				labels.add(curvedText("dantya/dental", path));

				path = describeArc(x,y,r*3.22,216,246);
				categories.add(s.path(path).attr({stroke:'red', strokeWidth: (r4-r3), fill:'none', opacity:0.2}));
				labels.add(curvedText("oshtya/labial", path));

				path = describeArc(x,y,r*3.22,246,450);
				categories.add(s.path(path).attr({stroke:'grey', strokeWidth: (r4-r3), fill:'none', opacity:0.2}));
				labels.add(curvedText("", path));

				centerLabel = s.text(x-25,y+15, String.fromCharCode(2384)).addClass('centreLabel')
				.transform('s1.5');

				tabs.add(categories);
				tabs.add(labels);
			}
		}
	};
});