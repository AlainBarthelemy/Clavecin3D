
// Constructor
function GUI(){
	this.events = {
		zoomIn:"zoom-in",
		zoomOut:"zoom-out",
		setRotateMode:"set-rotate-mode",
		setPanMode:"set-pan-mode",
		viewDeco:"view-deco",
		viewTech:"view-tech",
		viewHisto:"view-histo",
		changeMode:"change-mode"
	};
	this.modes = {
		tech:"tech-mode",
		elre:"elre-mode",
		histo:"histo-mode",
		qqc:"qqc-mode",
		resto:"resto-mode",
		ipad:"ipad-mode",
		info:"info",
		none:"none"
	};
	
	this.controlsModes = {
		threeD:"threeD",
		bck:"bck",
		none:"none"
	}
	
	this.diapos = {
		qqc:[
			"contents/qqc/diapo/fondpanneaux1.jpg",
			"contents/qqc/diapo/fondpanneaux2.jpg",
			"contents/qqc/diapo/fondpanneaux3.jpg",
			"contents/qqc/diapo/fondpanneaux4.jpg",
			"contents/qqc/diapo/fondpanneaux5.jpg",
			"contents/qqc/diapo/fondpanneaux6.jpg",
		],
		resto:[
			"contents/resto/diapo/fondpanneaux1.jpg",
			"contents/resto/diapo/fondpanneaux2.jpg",
			"contents/resto/diapo/fondpanneaux3.jpg",
			"contents/resto/diapo/fondpanneaux4.jpg",
			"contents/resto/diapo/fondpanneaux5.jpg",
			"contents/resto/diapo/fondpanneaux6.jpg",
		]
	}
	
	this.currentMode = this.modes.none;
	this.currentControlsMode = this.controlsModes.threeD;
	this.EASING_TIME = 300;
	
	
	
	var scope = this;	
	$(window).load(function() {
		scope.addEventsListeners();
		
		scope.miniDiapoResto = new MiniDiapo("#miniDiapo-resto");
		scope.miniDiapoQqc = new MiniDiapo("#miniDiapo-qqc");
		
		scope.miniDiapoResto.populate(scope.diapos.resto);
		scope.miniDiapoQqc.populate(scope.diapos.qqc);
		
		// hack for touch resize
		document.getElementById("panel-secondary" ).addEventListener( 'touchmove', touchmove, false );
		
		// no context menu
		$(window).on('contextmenu', function(event){
				event.preventDefault();
		});
		//scope.changeActiveDDBtn($('#info-dd-btn'));
		//scope.loadPrimaryContent("contents/info/content.html");
		
		$(".bck-img").panzoom({
			increment: 0.3,
			contain: 'invert',
			minScale: 1,
			maxScale: 5,
			transition: true,
		});
	});
}

GUI.prototype.addEventsListeners = function(){
	var scope = this;
	
	$('.navbar-brand').click(function(){
		//$('#main-nav').toggleClass('mini-navbar');
		//$('.navbar-brand').toggleClass('mini-brand');		
		scope.toggleMenu();
	});
	$(document).on('click','#panel-primary #close-btn', function(event){
		scope.closePanel($('#panel-primary'));
		scope.closePanel($('#panel-secondary'));
		scope.closePanel($('#panel-tertiary'));
		
		// resto mode is the only case when closing the primary panel won't make it switch to mode none
		//if(scope.currentMode != scope.modes.resto)
		scope.changeMode(scope.modes.none);
		
		//scope.openMenu();
	});
	$(document).on('click touchstart','#panel-secondary #close-btn', function(event){
		scope.closePanel($('#panel-secondary'));
		scope.closePanel($('#panel-tertiary'));
		if(scope.currentMode == scope.modes.elre || scope.currentMode == scope.modes.ipad)
			$(".img-selected").removeClass("img-selected");
		else
			$(".link-selected").removeClass("link-selected");
	});
	$(document).on('click','#panel-tertiary #close-btn', function(event){
		scope.closePanel($('#panel-tertiary'));
		
	});
	
	// menu buttons
	$('#technique-dd-btn').click(function(){
			if(! $('#technique-dd-btn').hasClass("active")){
				scope.changeMode(scope.modes.tech);
				//scope.closeMenu();
			}
			
	});
	$('#elre-dd-btn').click(function(){
			if(! $('#elre-dd-btn').hasClass("active")){
				scope.changeMode(scope.modes.elre);
				//scope.closeMenu();
			}
			
	});
	$('#histo-dd-btn').click(function(){
			if(! $('#histo-dd-btn').hasClass("active")){
				scope.changeMode(scope.modes.histo);
				//scope.closeMenu();
			}
			
	});
	$('#resto-dd-btn').click(function(){
			// if we are in another mode
			if(! $('#resto-dd-btn').hasClass("active")){
				scope.changeMode(scope.modes.resto);
			//}else{// if we are in resto mode already
				//$("#panel-primary").fadeIn(scope.EASING_TIME);
				//scope.closeMenu();
			}
			
	});
	$('#qqc-dd-btn').click(function(){
			if(! $('#qqc-dd-btn').hasClass("active")){
				scope.changeMode(scope.modes.qqc);
				//scope.closeMenu();
			}
			
	});
	$('#ipad-dd-btn').click(function(){
			if(! $('#ipad-dd-btn').hasClass("active")){
				scope.changeMode(scope.modes.ipad);
				//scope.closeMenu();
			}
			
	});
	$('#info-dd-btn').click(function(){
			if(! $('#info-dd-btn').hasClass("active")){
				scope.changeMode(scope.modes.info);
				//scope.closeMenu();
			}
			
	});

	// pop up items
	// elre
	$(document).on('click','.item',function(event){
		if(!$(this).hasClass("img-selected")){
			$(".img-selected").removeClass("img-selected");
			$(this).addClass("img-selected");
			//dirty --> watch out buggy
			var filename = event.target.src.substring(event.target.src.lastIndexOf('/')+1);
			scope.loadSecondaryContent("contents/elre/panel-secondary.php",{imgsrc:"contents/elre/1920x1080/"+filename,"id":event.currentTarget.id});
			scope.loadTertiaryContent("contents/elre/panel-tertiary.php",{"id":event.currentTarget.id});
			//scope.loadSecondaryContent("contents/elre/panel-secondary.php",{imgsrc:event.target.src.replace("thumbnails","1920x1080")});
			scope.emitEvent(scope.events.viewDeco,{"id":event.currentTarget.id});
		}
	});
	
	// tech
	$(document).on('click','.techItem',function(event){
		if(!$(this).children().hasClass("link-selected")){
			$(".link-selected").removeClass("link-selected");
			$(this).addClass("link-selected");
			scope.loadSecondaryContent("contents/technique/panel-secondary.php",{id:event.target.id,title:event.target.innerHTML});
			scope.emitEvent(scope.events.viewTech,{id:event.target.id});
		}
	});
	
	// histo
	$(document).on('click','.histoItem',function(event){
		if(!$(this).children().hasClass("link-selected")){
			$(".link-selected").removeClass("link-selected");
			$(this).addClass("link-selected");
			scope.loadSecondaryContent("contents/histo/panel-secondary.php",{id:event.target.id});
			scope.emitEvent(scope.events.viewHisto,{id:event.target.id});
		}
	});
	
	// resto
	$(document).on('click','.restoItem',function(event){
		if(!$(this).children().hasClass("link-selected")){
			
			$(".link-selected").removeClass("link-selected");
			$(this).addClass("link-selected");
			scope.miniDiapoResto.stop();
			
			scope.resetBckPosition();
			
			if(event.target.id == "film"){
				scope.loadSecondaryContent("contents/resto/panel-secondary.php",{id:event.target.id});
				scope.hideBackgroundImage();
				scope.miniDiapoResto.goTo(5);
				scope.miniDiapoResto.show();
				
			}else{
				scope.closePanel($('#panel-secondary'));
				scope.miniDiapoResto.hide();
				scope.showBackgroundImage(event.target.id);
			}
			//scope.closePanel($('#panel-primary'));
			//scope.changeMode(scope.modes.none);
		}
	});

	// qqc
	$(document).on('click','.qqcItem',function(event){
		if(!$(this).children().hasClass("link-selected")){
			$(".link-selected").removeClass("link-selected");
			$(this).addClass("link-selected");
			scope.miniDiapoQqc.stop();
			scope.miniDiapoQqc.hide();
			
			scope.resetBckPosition();
			
			scope.showBackgroundImage(event.target.id);
		}
	});

	// ipad
	$(document).on('click','.ipadItem',function(event){
		if(!$(this).hasClass("img-selected")){
			$(".img-selected").removeClass("img-selected");
			$(this).addClass("img-selected");
			scope.loadSecondaryContent("contents/ipad/panel-secondary.php",{id:event.currentTarget.id});
		}
	});
	
	$('#zoom-in-btn').click(function(){
		if(scope.currentMode == scope.modes.qqc || scope.currentMode == scope.modes.resto)
			$(".bck-img").panzoom("zoom");
		else
			scope.emitEvent(scope.events.zoomIn);
		
	});
	$('#zoom-out-btn').click(function(){
		if(scope.currentMode == scope.modes.qqc || scope.currentMode == scope.modes.resto)
			scope.emitEvent(scope.events.zoomOut);
		else
			$(".bck-img").panzoom("zoom",true);
	});
	$('#move-btn').click(function(){
	
		if(! $('#move-btn').hasClass("btn-primary")){
			$('#rotate-btn').removeClass("btn-primary");
			$('#rotate-btn').addClass("btn-default");
			$('#move-btn').addClass("btn-primary");
			$('#move-btn').removeClass("btn-default");
			
			scope.emitEvent(scope.events.setPanMode);	
		}
				
	});
	$('#rotate-btn').click(function(){
		
		
			
		if(! $('#rotate-btn').hasClass("btn-primary")){
			$('#move-btn').removeClass("btn-primary");
			$('#move-btn').addClass("btn-default");
			$('#rotate-btn').addClass("btn-primary");
			$('#rotate-btn').removeClass("btn-default");
			
			scope.emitEvent(scope.events.setRotateMode);
		}
	});	
	/*$('#view-one-btn').click(function(){
		scope.emitEvent(scope.events.viewOne);
	});
	$('#view-two-btn').click(function(){
		scope.emitEvent(scope.events.viewTwo);
	});
	$('#view-three-btn').click(function(){
		scope.emitEvent(scope.events.viewThree);
	});*/
	
};

GUI.prototype.changeMode = function(newMode){
	
	// if we are in resto mode and a video is loaded
	if(this.currentMode == this.modes.resto && $( "#video-player" ).length)
		this.stopVideo();
	
	// if we go from histo to anorther mode unless we just close the primary window
	if(this.currentMode == this.modes.resto){
		this.miniDiapoResto.hide();
		this.miniDiapoResto.stop();
		this.hideBackgroundImage();	
		this.resetBckPosition();
	}else if(this.currentMode == this.modes.qqc){
		this.miniDiapoQqc.hide();
		this.miniDiapoQqc.stop();
		this.hideBackgroundImage();	
		this.resetBckPosition();
	}else if(this.currentMode == this.modes.ipad){
		this.hideBackgroundImage();	
	}
	
	switch(newMode){
	 	case this.modes.tech:
	 			this.currentMode = this.modes.tech;
	 			this.changeControlsMode(this.controlsModes.threeD);
	 			this.changeActiveDDBtn($('#technique-dd-btn'));
				this.loadPrimaryContent("contents/technique/content.html");
				this.emitEvent(this.events.changeMode,{newMode:this.modes.tech});
				
				$("#canvas-container").show();
			break;
		case this.modes.elre:
				this.currentMode = this.modes.elre;
				this.changeControlsMode(this.controlsModes.threeD);
				this.changeActiveDDBtn($('#elre-dd-btn'));
				this.loadPrimaryContent("contents/elre/content.html");
				this.emitEvent(this.events.changeMode,{newMode:this.modes.elre});
			
				$("#canvas-container").show();
			break;
		case this.modes.histo:
				this.currentMode = this.modes.histo;
				this.changeControlsMode(this.controlsModes.threeD);
				this.changeActiveDDBtn($('#histo-dd-btn'));
				this.loadPrimaryContent("contents/histo/content.html");
				this.emitEvent(this.events.changeMode,{newMode:this.modes.histo});
				
				$("#canvas-container").show();
			break;
		case this.modes.resto:
				this.currentMode = this.modes.resto;
				this.changeControlsMode(this.controlsModes.bck);
				this.changeActiveDDBtn($('#resto-dd-btn'));
				this.loadPrimaryContent("contents/resto/content.html");
				this.emitEvent(this.events.changeMode,{newMode:this.modes.resto});
				
				this.miniDiapoResto.show();
				this.miniDiapoResto.start();
				$("#canvas-container").hide();
			break;
		case this.modes.qqc:
				this.currentMode = this.modes.qqc;
				this.changeControlsMode(this.controlsModes.bck);
				this.changeActiveDDBtn($('#qqc-dd-btn'));
				this.loadPrimaryContent("contents/qqc/content.html");
				this.emitEvent(this.events.changeMode,{newMode:this.modes.qqc});
				
				this.miniDiapoQqc.show();
				this.miniDiapoQqc.start();
				$("#canvas-container").hide();
			break;
		case this.modes.ipad:
				this.currentMode = this.modes.ipad;
				this.changeControlsMode(this.controlsModes.none);
				this.changeActiveDDBtn($('#ipad-dd-btn'));
				this.loadPrimaryContent("contents/ipad/content.html");
				this.emitEvent(this.events.changeMode,{newMode:this.modes.ipad});
				
				this.showBackgroundImage("ipad");
				
				$("#canvas-container").hide();
			break;
		case this.modes.info:
				this.currentMode = this.modes.info;
				this.changeControlsMode(this.controlsModes.threeD);
				this.changeActiveDDBtn($('#info-dd-btn'));
				this.loadPrimaryContent("contents/info/content.html");
				this.emitEvent(this.events.changeMode,{newMode:this.modes.info});
				
				$("#canvas-container").show();
			break;
		case this.modes.none:
				this.currentMode = this.modes.none;
				this.changeControlsMode(this.controlsModes.threeD);
				this.deactivateAllDDBtn();
				this.emitEvent(this.events.changeMode,{newMode:this.modes.none});
				
				$("#canvas-container").show();
			break;
		default:
			console.log("unknown mode");
			break;
		
	}
	
}

GUI.prototype.changeControlsMode = function(newMode){
	
	switch(newMode){
		
	case this.controlsModes.threeD:
		
		$('.btn-group-vertical').show();
		
		$('#rotate-btn').show();
		
		$('#move-btn').removeClass("btn-primary");
		$('#move-btn').addClass("btn-default");
		$('#rotate-btn').addClass("btn-primary");
		$('#rotate-btn').removeClass("btn-default");
		
		this.emitEvent(this.events.setRotateMode);
		
	break;
	case this.controlsModes.bck:
		
		$('.btn-group-vertical').show();
		
		$('#rotate-btn').hide();
		
		$('#move-btn').addClass("btn-primary");
		$('#move-btn').removeClass("btn-default");
		$('#rotate-btn').removeClass("btn-primary");
		$('#rotate-btn').addClass("btn-default");
	
	break;
	case this.controlsModes.none:
	
		$('.btn-group-vertical').hide();
	
	break;
		
	default:
		console.log("unknown controls mode");
	break;
	}
}

GUI.prototype.closePanel = function(element){
	
	element.fadeOut(this.EASING_TIME);	
	
	if(element.selector == "#panel-secondary" && $( "#video-player" ).length)
		this.stopVideo();
}

GUI.prototype.emitEvent = function(eventType,eventData){
	//var event = new Event(eventType);
	var event = new CustomEvent(eventType,{"detail":eventData});
	document.dispatchEvent(event);
};

GUI.prototype.changeActiveDDBtn = function(element){
	this.deactivateAllDDBtn();
	element.addClass("active");
}
GUI.prototype.deactivateAllDDBtn = function(){
	if($(".dropdown-toggle.active").length >0){
		$(".dropdown-toggle.active").each(function(){
			$(this).removeClass("active");	
		});
	}
}

GUI.prototype.loadPrimaryContent = function(url){
	$("#panel-tertiary").hide();
	$("#panel-secondary").hide();
	$("#panel-primary").hide();
	
	if(this.currentMode == this.modes.resto){
		$("#panel-primary").addClass("panel-resto");	
	}else{
		$("#panel-primary").removeClass("panel-resto");
	}
	
	if(this.currentMode == this.modes.ipad){
		$("#panel-primary").addClass("panel-600");	
	}else{
		$("#panel-primary").removeClass("panel-600");
	}
	
	var scope = this;
	$("#panel-primary").load(url, function(){
		// load complete
		$("#panel-primary").fadeIn(scope.EASING_TIME);

	});
}

GUI.prototype.loadSecondaryContent = function(url,data){
	var scope = this;
	$("#panel-tertiary").hide();
	$("#panel-secondary").hide();
	
	switch(this.currentMode){
	 	case this.modes.tech:
	 		$("#panel-secondary").removeClass('panel-large');
	 		$("#panel-secondary").removeClass('panel-elre');
	 		$("#panel-secondary").removeClass('panel-ipad');
	 		$("#panel-secondary").removeClass('panel-film');
			break;
		case this.modes.elre:
			$("#panel-secondary").addClass('panel-large');
			$("#panel-secondary").addClass('panel-elre');
			$("#panel-secondary").removeClass('panel-ipad');
			$("#panel-secondary").removeClass('panel-film');
			break;
		case this.modes.histo:
			$("#panel-secondary").addClass('panel-large');
			$("#panel-secondary").removeClass('panel-elre');
			$("#panel-secondary").removeClass('panel-ipad');
			$("#panel-secondary").removeClass('panel-film');
			break;
		case this.modes.resto:
	 		$("#panel-secondary").removeClass('panel-large');
	 		$("#panel-secondary").removeClass('panel-elre');
	 		$("#panel-secondary").removeClass('panel-ipad');
	 		$("#panel-secondary").addClass('panel-film');
			break;
		case this.modes.qqc:
	 		$("#panel-secondary").removeClass('panel-large');
	 		$("#panel-secondary").removeClass('panel-elre');
	 		$("#panel-secondary").removeClass('panel-ipad');
	 		$("#panel-secondary").removeClass('panel-film');
			break;
		case this.modes.ipad:
	 		$("#panel-secondary").removeClass('panel-large');
	 		$("#panel-secondary").removeClass('panel-elre');
	 		$("#panel-secondary").addClass('panel-ipad');
	 		$("#panel-secondary").removeClass('panel-film');
	 		break;
		case this.modes.info:
			$("#panel-secondary").removeClass('panel-large');
			$("#panel-secondary").removeClass('panel-elre');
			$("#panel-secondary").removeClass('panel-ipad');
			$("#panel-secondary").removeClass('panel-film');
			break;
		case this.modes.none:
			$("#panel-secondary").removeClass('panel-large');
			$("#panel-secondary").removeClass('panel-elre');
			$("#panel-secondary").removeClass('panel-ipad');
			$("#panel-secondary").removeClass('panel-film');
			break;
		default:
			console.log("unkonwn mode");
			break;
		
	}
	
	
		
	
	$.get( url, data ).done(function( data ) {
			$("#panel-secondary").html(data);
			
			// in the other modes we wait for a 3D anim to complete before showing the secondary p
			if(scope.currentMode == scope.modes.ipad || scope.currentMode == scope.modes.resto){
				scope.showPanelSecondary();
			}
			//scope.showPanelSecondary();	
	});
}

GUI.prototype.loadTertiaryContent = function(url,data){
	$("#panel-tertiary").hide();
	var scope = this;
	$.get( url, data ).done(function( data ) {
			$("#panel-tertiary").html(data);
	});
}
GUI.prototype.showPanelTertiary = function(){
	$("#panel-tertiary").fadeIn(this.EASING_TIME);	
}

GUI.prototype.showPanelSecondary = function(){
	this.resetDR();
	$("#panel-secondary").fadeIn(this.EASING_TIME);	
}

// for resto
GUI.prototype.showBackgroundImage = function(id){
	/*$(".resto-img").addClass("hidden");
	$("#"+id+"-img").removeClass("hidden");*/
	
	
/*	$(".bck-img").removeClass("bck-shown");
	$("#"+id+"-img").addClass("bck-shown");*/
	$(".bck-img").hide();
	$("#"+id+"-img").fadeIn(500);
	
	$("#bck-img-container").fadeIn();
}
GUI.prototype.hideBackgroundImage = function(){
	
	/*$(".bck-img").removeClass("bck-shown");*/
	$(".bck-img").hide();
	$("#bck-img-container").hide();
}


// reset draggable popup ?
GUI.prototype.resetDR = function(){
	
	var resizableOptions = {
		resize: function(event, ui) {
        ui.size.height = ui.originalSize.height;
        },
        aspectRatio: false,
        minWidth: 460,
        maxWidth:1920,
        handles:"e"
    }
	
	$('#panel-secondary').attr('style', '');
	if (typeof $( "#panel-secondary" ).draggable("instance") != 'undefined')
		$( "#panel-secondary" ).draggable("destroy")
	if (typeof $( "#panel-secondary" ).resizable("instance") != 'undefined')
		$( "#panel-secondary" ).resizable("destroy")
	
	$('#panel-tertiary').attr('style', '');
	if (typeof $( "#panel-tertiary" ).draggable("instance") != 'undefined')
		$( "#panel-tertiary" ).draggable("destroy")
	if (typeof $( "#panel-tertiary" ).resizable("instance") != 'undefined')
		$( "#panel-tertiary" ).resizable("destroy")
	
	$("#panel-tertiary").hide();
	
	switch(this.currentMode){
	 	case this.modes.tech:
	 		$("#panel-secondary").draggable();
			break;
		case this.modes.elre:
			$("#panel-secondary").draggable().resizable(resizableOptions);
			$("#panel-tertiary").draggable();
			break;
		case this.modes.histo:
			$("#panel-secondary").draggable().resizable(resizableOptions);
			break;
		case this.modes.qqc:
		case this.modes.resto:
		case this.modes.ipad:
		case this.modes.none:
			break;
		default:
			console.log("unkonwn mode");
			break;
		
	}
	
	
	// hack for touch resize
	//document.getElementById("panel-secondary" ).addEventListener( 'touchmove', touchmove, false );
/*	var lastDistance = null ;
	function touchmove(event){
		
		//event.preventDefault();
		//event.stopPropagation();
		if(event.touches.length ==2 && typeof $( "#panel-secondary" ).resizable("instance") != 'undefined'){
			var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
			var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
			var distance = Math.sqrt( dx * dx + dy * dy );
			
			if(lastDistance == null)
				lastDistance = distance;
			var diff = distance-lastDistance;
			lastDistance = distance;
			//console.log(diff);
			if(diff>0 && $("#panel-secondary").width() < resizableOptions.maxWidth){
				$("#panel-secondary").css("width","+=2");
				//$("#panel-secondary").css("left","-=1.5");
				//$("#panel-secondary").css("top","-=1.5");
			}else if (diff<0 && $("#panel-secondary").width() > resizableOptions.minWidth){
				$("#panel-secondary").css("width","-=2");
				//$("#panel-secondary").css("left","+=1.5");
				//$("#panel-secondary").css("top","+=1.5");
			}
		
		}
	}*/

	
}

GUI.prototype.toggleMenu = function(){
	$('#main-nav').toggleClass('mini-navbar');
	$('.navbar-brand').toggleClass('mini-brand');
}

GUI.prototype.openMenu = function(){
	$('#main-nav').removeClass('mini-navbar');
	$('.navbar-brand').removeClass('mini-brand');
}

GUI.prototype.closeMenu = function(){
	$('#main-nav').addClass('mini-navbar');
	$('.navbar-brand').addClass('mini-brand');
}

GUI.prototype.stopVideo = function(){
	$("#video-player")[0].pause();
	$("#video-player")[0].seekable.start(0);
}

GUI.prototype.resetBckPosition = function(){
	$(".bck-img").panzoom("resetZoom");	
	$(".bck-img").panzoom("resetPan");	
}

var lastDistance = null ;
function touchmove(event){
	
	var resizableOptions = {
		resize: function(event, ui) {
        ui.size.height = ui.originalSize.height;
        },
        aspectRatio: false,
        minWidth: 460,
        maxWidth:1920,
        handles:"e"
    }
	
	//event.preventDefault();
	//event.stopPropagation();
	if(event.touches.length >=2 && typeof $( "#panel-secondary" ).resizable("instance") != 'undefined'){
		var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
		var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
		var distance = Math.sqrt( dx * dx + dy * dy );
		
		if(lastDistance == null)
			lastDistance = distance;
		var diff = distance-lastDistance;
		lastDistance = distance;
		//console.log(diff);
		if(diff>0 && $("#panel-secondary").width() < resizableOptions.maxWidth){
			$("#panel-secondary").css("width","+=4");
			//$("#panel-secondary").css("left","-=1.5");
			//$("#panel-secondary").css("top","-=1.5");
		}else if (diff<0 && $("#panel-secondary").width() > resizableOptions.minWidth){
			$("#panel-secondary").css("width","-=4");
			//$("#panel-secondary").css("left","+=1.5");
			//$("#panel-secondary").css("top","+=1.5");
		}
	
	}
}

