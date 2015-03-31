//ROUTE IPAD
var ipad = window.location.hash.substring(1);

//RUN
window.onload = function()
{
	//INIT
	drawer = new Drawer(1024,768);
	drawer.reset();
	
	//MENU FILL
	$("#homelink").load('./data/'+ipad+'/text.html?'+drawer.cache+' #title');
	$("#menu_content").load('./data/'+ipad+'/text.html?'+drawer.cache+' #menu', function() {

		//BIND MENU LINKS
		$('.link1').mousedown( function() {
			drawer.source = 2;
			drawer.reset();
			$('.container').addClass('closed');
		});
		$('.link2').mousedown( function() {
			drawer.source = 2;
			drawer.reset(4);
			$('.container').addClass('closed');
		});
		$('.link3').mousedown( function() {
			drawer.source = 3;
			drawer.reset(4);
			$('.container').addClass('closed');
		});
		$('.link4').mousedown( function() {
			drawer.source = 4;
			drawer.reset(4);
			$('.container').addClass('closed');
		});
		$('.link5').mousedown( function() {
			drawer.source = 5;
			drawer.reset(4);
			$('.container').addClass('closed');
		});
		$('.link6').mousedown( function() {
			drawer.source = 6;
			drawer.reset(4);
			$('.container').addClass('closed');
		});
		$('.link7').mousedown( function() {
			drawer.source = 7;
			drawer.reset(4);
			$('.container').addClass('closed');
		});
		$('.linkDiapo').mousedown( drawer.startdiapo );
		$('.linkCredits').mousedown( drawer.startcredits );

	});

	//MOUSE && TOUCH CONTROL::
	$('#viewLayer').mousedown(function(e){ drawer.touchstart(e);  });
	$('#viewLayer').mousemove(function(e){ skipmoves(e); });
	$('#viewLayer').mouseup(function(e){ drawer.touchend(e); });

	$('#viewLayer').bind('pinchopen', function() { if (drawer.moving) {drawer.zoom.zoomin(); drawer.show(); }} );
	$('#viewLayer').bind('pinchclose', function() { if (drawer.moving) {drawer.zoom.zoomout(); drawer.show(); }} );

	//ZOOM CTRL
	$('#zoominbtn').mousedown(function() { drawer.zoom.zoomin(); drawer.show(); });
	$('#zoomoutbtn').mousedown(function() { drawer.zoom.zoomout(); drawer.show(); });
	//$('.movebtn').mousedown(function() { $('.movebtn').toggle(); drawer.moving = !drawer.moving; });
	$('.movebtn').hide();

	//RESET BTN
	$('#resetbtn').mousedown( function() { 
		$('.container').addClass('closed');
		$("#rideau").removeClass('closed');
		setTimeout( function() { that.reset(); }, 400 ); 
	});

	//IDLE HOME
	$.idleTimer({timeout:60000, idle:true, events: 'mousemove mousedown touchstart touchmove'});
	$( document ).on( "idle.idleTimer", function(event, elem, obj){ 
		$('#homeimage').removeClass('closed');
		setTimeout( function() {
			drawer.source = 2;
			$("#resetbtn").mousedown();
			$('#helpwin').removeClass('closed'); 
		}
		, 1000);
	});

	//NEXT IMAGE BTN
	$('#nextbtn').mousedown( drawer.step6.bind(drawer) );
}

/* Keep CPUs to a minimum. */
var MOUSE_MOVE_THRESHOLD = 20,
    lastMouseMoveTime = -1;

function skipmoves(ev) {
        var now = +new Date;
        if(now - lastMouseMoveTime < MOUSE_MOVE_THRESHOLD)
            return;
        lastMouseMoveTime = now;
     
        drawer.touchmove(ev);
}


// prevent elastic scrolling
document.body.addEventListener('touchmove',function(event){ event.preventDefault();},false);	// end body:touchmove

document.addEventListener("touchstart", touchHandler, true);
document.addEventListener("touchmove", touchHandler, true);
document.addEventListener("touchend", touchHandler, true);
document.addEventListener("touchcancel", touchHandler, true);

//SIMULATE Mouse from Touch
function touchHandler(event) {
	
	//1 FINGER
 	if (event.targetTouches.length <= 1) 
 	{
 		

 		var touch = event.changedTouches[0];
 		var simulatedEvent = document.createEvent("MouseEvent");
		simulatedEvent.initMouseEvent({
			touchstart: "mousedown",
			touchmove: "mousemove",
			touchend: "mouseup"
		}[event.type], true, true, window, 1,
									  touch.screenX, touch.screenY,
									  touch.clientX, touch.clientY, false,
									  false, false, false, 0, null);

		touch.target.dispatchEvent(simulatedEvent);

		event.preventDefault();
 	} 	
}

function Drawer (width,height) {
	
	//canvas
	this.view = $('#viewCan')[0];
	this.render = $('#renderCan')[0];
	this.buffer = $('#bufferCan')[0];
	this.sourcecan = $('#sourceCan')[0];

	//config
	this.interpolate = 0;				//interpolation depth. [0 - 100] 	0: disable interpolation   size=100-interpolate
	this.blurring = 10;					//blurring depth [0 - 100]  		0: disable blur
	this.renderWidth = width;
	this.renderHeight = height;
	
	//variables
	this.dragging = false;
	this.fading = false;
	this.moving = false;
	this.source = 2;
	this.ready_TOP = false;
	this.ready_SOURCE = false;
	this.progress = 0;
	this.forcestep = 1;
	this.pincher = false;
	this.zoomer = 1;
	this.cache = 42;

	this.reset = function(step) 
	{
		if (step === undefined) step = 1;
		this.forcestep = step;
		drawer.stopmove();

		//tools
		this.zoom = new Zoom(this.renderWidth, this.renderHeight, this.render); 
		this.brush = new circleBrush(60, this.blurring);    //brush type and config	
		this.interpolator = null;

		//load images
		if (!this.ready_TOP) this.init();
		else this.loadsource();
	};

	//init images and canvas
	this.init = function() 
	{
		//IMAGE TOP
		this.ready_TOP = false;
		var image = $('<img />',{src: './data/'+ipad+'/image/1.jpg?'+ this.cache})
		this.topImage = image[0];
		that = this;
		onImageReady(image, function() {
			
			//VIEW
			that.view.width = that.renderWidth; 
			that.view.height = that.renderHeight;
		
			//RENDER SIZE
			that.render.height = that.renderHeight;
			that.render.width = Math.floor(that.renderHeight*that.topImage.width/that.topImage.height);

			//SOURCE
			that.sourcecan.width = that.render.width; 
			that.sourcecan.height = that.render.height;

			//BUFFER
			that.buffer.width = that.render.width; 
			that.buffer.height = that.render.height;
			that.buffer.getContext('2d').globalCompositeOperation = 'destination-atop';

			that.ready_TOP = true;
			if (that.ready_SOURCE) that.clear(); 
		});

		this.loadsource();
	};

	this.loadsource = function() 
	{
		//HIDE EVERY INFO
		//$("#legendbar").addClass('closed');
		$("#infowin").addClass('closed');
		$("#nextbtn").addClass('closed');
		$('#sidebar').addClass('closed'); 

		var that = this;
		setTimeout(function() {
			//IMAGES SOURCE
			that.ready_SOURCE = false;
			var image = $('<img />',{src: './data/'+ipad+'/image/'+that.source+'.jpg?' + that.cache});
			that.sourceImage = image[0];
			onImageReady(image, function() {
				that.ready_SOURCE = true;
				if (that.ready_TOP) that.clear(); 
			});
		}, 250);
	};
	
	//CLEAR canvas
	this.clear = function()
	{
		//stop fading
		this.fading = false;
		this.render.getContext('2d').globalAlpha = 1;

		//redraw rcanvas		
		if (this.forcestep == 1)
		{
			this.progress = 0;
			this.buffer.getContext('2d').clearRect ( 0 , 0 , this.buffer.width, this.buffer.height );
			this.render.getContext('2d').drawImage(this.topImage, 0, 0, this.topImage.width, this.topImage.height, 0, 0, this.render.width, this.render.height);
			this.sourcecan.getContext('2d').drawImage(this.sourceImage, 0, 0, this.sourceImage.width, this.sourceImage.height, 0, 0, this.sourcecan.width, this.sourcecan.height);
		}
		else if (this.forcestep == 4)
		{
			this.progress = 1000;
			this.render.getContext('2d').clearRect ( 0 , 0 , this.render.width, this.render.height );
			this.sourcecan.getContext('2d').drawImage(this.sourceImage, 0, 0, this.sourceImage.width, this.sourceImage.height, 0, 0, this.sourcecan.width, this.sourcecan.height);
		}

		//step 1 (trigger by help close on first source)
		if ((this.forcestep == 1) ) 
		{
			//set menu active
			$('#titlewin').html($('.link1').html());
			$('.menulink').removeClass('active');
			if (this.source == 2) 
				$('.link1').addClass('active');
			else 
				$('.link'+this.source).addClass('active');
				

			//start step1 (if helpwin closed)
			if ($('#helpwin').hasClass('closed')) this.step1();
		}
		//jump to step4
		else if (this.forcestep == 4) this.step4();

		//load legend && info image1
		$("#legendbar").load('./data/'+ipad+'/text.html?'+this.cache+' #legend');
		$("#infowin").load('./data/'+ipad+'/text.html?'+this.cache+' #text1');

		$("#rideau").addClass('closed');

		this.show();
	};
	
	//PAINT Render
	this.paint = function ( center )
	{
		var pos = this.brush.move( center, this.sourcecan );
		this.buffer.getContext('2d').drawImage( this.brush.draw(), pos.x, pos.y);
		this.render.getContext('2d').drawImage(this.buffer,0,0);
		this.show();
	}
	
	//SHOW render to view
	this.show = function ()
	{		
		var crop = this.zoom.crop();	
		this.view.getContext('2d').drawImage( this.render, crop.x, crop.y, crop.w , crop.h  ,0,0, this.view.width, this.view.height);
	};

	//FADE TOP out
	this.fadeout = function (start) {
		
		var ctx = this.render.getContext('2d');
		if (start === true) 
		{
			this.fading = true;
			ctx.globalAlpha = 0;
		}
		if (!this.fading) return;

		//FADE LOOP
		if (ctx.globalAlpha < 0.8)	
		{
			if (ctx.globalAlpha > 0.7) ctx.globalAlpha += 0.09;
			else if (ctx.globalAlpha > 0.4) ctx.globalAlpha += 0.03;
			else ctx.globalAlpha += 0.008;
			ctx.drawImage(this.sourcecan,0,0);
			this.show();
			setTimeout(this.fadeout.bind(this),30);
		}

		//FINISHED
		else
		{
			this.fading = false;
			ctx.globalAlpha = 1;
		}
	}

	this.startdiapo = function() {	
		$("#diapocontainer").removeClass('closed');
		$('#creditscontainer').addClass('closed');
		
		setTimeout(function() {
			if (diapo == 0) diapoload('next');
			$('.menulink').removeClass('active');
			$('.linkDiapo').addClass('active');
		},500);

		$("#legendbar").addClass('closed');
		$("#sidebar").addClass('closed');
		$("#infowin").addClass('closed');
		$("#nextbtn").addClass('closed');
		$('#helpwin').addClass('closed');
	}

	this.startcredits = function() {	
		
		$("#creditscontainer").removeClass('closed');
		$('#diapocontainer').addClass('closed');

		setTimeout(function() {
			$("#creditscontent").load('./data/credits.html?'+this.cache);
			$('.menulink').removeClass('active');
			$('.linkCredits').addClass('active');
		},500);

		$("#legendbar").addClass('closed');
		$("#sidebar").addClass('closed');
		$("#infowin").addClass('closed');
		$("#nextbtn").addClass('closed');
		$('#helpwin').addClass('closed');
	}

	this.startmove = function()
	{
		$('#zoominbtn').show();
		$('#zoomoutbtn').show();
		//$('#movebtn1').hide();
		//$('#movebtn2').show();
		drawer.moving = true;
	}

	this.stopmove = function()
	{
		$('#zoominbtn').hide();
		$('#zoomoutbtn').hide();
		//$('#movebtn1').show();
		//$('#movebtn2').hide();
		drawer.moving = false;
	}
	
	//TOUCH START
	this.touchstart = function(e) {
		
		//check if diapo si opened
		if (!$("#diapocontainer").hasClass('closed')) return;

		if (this.moving) this.zoom.lastpress = getPos(e);
		else if (this.interpolate > 0)
		{
			this.interpolator = new Interpoler( getPosView(e, this.zoom), this );
			this.interpolator.trace();
		}

		//initial show (after help close)
		if ((this.progress == 0) && (this.source == 2)) this.step1();
	
		this.dragging = true;
	}
	
	//MOVE
	this.touchmove = function(e) {
		if (this.dragging)
		{ 
			if (this.moving) 
			{
				this.zoom.move( getPos(e) ); 
				this.show(); 
			}
			else if(!this.fading)
			{
				//paint
				if (this.interpolate > 0) this.interpolator.addpoint( getPosView(e, this.zoom) );
				else this.paint( getPosView(e, this.zoom) );

				this.progress++;

				//remove legend
				if (this.progress == 50) this.step2(); //obsolete

				//switch to text B1
				if (this.progress == 80) this.step3();
				
				//fadeout
				if (this.progress == 180) this.step4();

			}
		}
		else this.touchstart(e);
		

		return false; //prevent ellastic move
	}
	
	//TOUCH STOP
	this.touchend = function(e) {
		if (this.interpolate > 0) delete this.interpolator;
		this.dragging = false;
	}

	//LEGEND && INFO

	//STEP0  ON FIRST DRAW
	this.step0 = function()
	{		
		//show info 1
		if ($("#infowin").html()) 
			setTimeout(function(){ $("#infowin").removeClass('closed'); }, 100);
	}

	//STEP1  ON RESET
	this.step1 = function()
	{
		if (this.source == 2) this.step0();

		//show legend
		setTimeout(function(){$("#legendbar").removeClass('closed'); }, 200);
	}

	//STEP2  REMOVE LEGEND 1  AFTER TOUCHMOVE ~50
	this.step2 = function()
	{
		//close legend and load legend 2
		/*$("#legendbar").addClass('closed',1000,'ease', (function() {
			$("#legendbar").load('./data/'+ipad+'/text.html #legend');
			}).bind(this)
		);*/
	}


	//STEP 3  SWITCH INFO 2 AFTER TOUCHMOVE ~80
	this.step3 = function()
	{
		var that = this;
		//close infowin 1 
		$("#infowin").addClass('closed');

		//load infowin 2 && fire when ready
		setTimeout(function() {
				$("#infowin").load('./data/'+ipad+'/text.html?'+that.cache+' #text'+that.source, function () {
					if ($("#infowin").html()) $("#infowin").removeClass('closed');
				});
		}, 1000);
	}

	//STEP4  FADEOUT // HIDE INFO 2 AFTER TOUCHMOVE ~200
	this.step4 = function()
	{
		//dezoom
		this.zoom.reset(); 
		this.show();		
		
		$('.menulink').removeClass('active');
		$('.link'+this.source).addClass('active');
		$('#titlewin').html($('.link'+this.source).html());

		var that = this;
		that.fadeout(true);

		//show legend
		setTimeout(function(){ $("#legendbar").removeClass('closed'); }, 500);
		
		//close infowin 2  && load infowin 3
		$("#infowin").addClass('closed');
		setTimeout(function() {$("#infowin").load('./data/'+ipad+'/text.html?'+that.cache+' #addon'+that.source);}, 800);

		//fire step5
		setTimeout( this.step5.bind(this) , 1500);
	}

	//STEP5  SHOW INFO 3 and NEXT AFTER FADEOUT and MOVE MODE
	this.step5 = function()
	{
		this.startmove();

		$("#infowin").removeClass('closed');
		
		//check if next link exist.. 
		$("#temp").load('./data/'+ipad+'/text.html?'+this.cache+' .link'+(this.source+1), function() {
						
			//fin des image, => diaporama
			if ($("#temp").html()) $('#nextbtn').html('Image scientifique suivante >>');
			else $('#nextbtn').html('Voir le Diaporama >>');

		});
		//show reset
		setTimeout(function(){ $("#nextbtn").removeClass('closed'); }, 1500);
	}
	
	//STEP 6 RIDEAU and RESET
	this.step6 = function()
	{
		var that = this;
		that.source++;

		that.stopmove();

		//check if next link exist.. 
		$("#temp").load('./data/'+ipad+'/text.html?'+that.cache+' .link'+that.source, function() {
			
			//fin des image, ouverture du diaporama
			//if (drawer.source == 3) {
			if (!$("#temp").html())  {
				that.startdiapo();//start diaporama complémentaire
				that.source = 2; //no more images :: rewind
			}

			//transition image suivante
			else $('#resetbtn').mousedown();

		});
	}
}
