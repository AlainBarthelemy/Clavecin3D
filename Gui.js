
// Constructor
function GUI(){
	this.events = {
		zoomIn:"zoom-in",
		zoomOut:"zoom-out",
		setRotateMode:"set-rotate-mode",
		setPanMode:"set-pan-mode",
		viewOne:"view-one",
		viewTwo:"view-two",
		viewThree:"view-three"
	};
	this.EASING_TIME = 100;
    var scope = this;	
	$(window).load(function() {
		scope.addEventsListeners();
	});
	
}

GUI.prototype.addEventsListeners = function(){
	var scope = this;
	$('#folder-toggle-btn').click(function(){
		$("#folder-toggle-btn > .glyphicon").toggleClass("glyphicon-chevron-up");
		$("#folder-toggle-btn > .glyphicon").toggleClass("glyphicon-chevron-down");
	});
	$(document).on('click','#panel-primary #close-btn', function(event){
		scope.closePanel($('#panel-primary'));
		scope.deactivateAllDDBtn();
	});
	
	$('#zoom-in-btn').click(function(){
		scope.emitEvent(scope.events.zoomIn);
	});
	$('#zoom-out-btn').click(function(){
		scope.emitEvent(scope.events.zoomOut);
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
	$('#view-one-btn').click(function(){
		scope.emitEvent(scope.events.viewOne);
	});
	$('#view-two-btn').click(function(){
		scope.emitEvent(scope.events.viewTwo);
	});
	$('#view-three-btn').click(function(){
		scope.emitEvent(scope.events.viewThree);
	});
	
	$('#technique-dd-btn').click(function(){
			if(! $('#technique-dd-btn').hasClass("active")){
				//$('#technique-dd-btn').addClass("active");
				scope.changeActiveDDBtn($('#technique-dd-btn'));
				scope.loadPrimaryContent("contents/technique/content.html");
			}
	});
	$('#elre-dd-btn').click(function(){
			if(! $('#elre-dd-btn').hasClass("active")){
				//$('#technique-dd-btn').addClass("active");
				scope.changeActiveDDBtn($('#elre-dd-btn'));
				scope.loadPrimaryContent("contents/elre/content.html");
			}
	});
};

GUI.prototype.closePanel = function(element){
	element.fadeOut(this.EASING_TIME);	
}

GUI.prototype.emitEvent = function(eventType,eventData){
	var event = new Event(eventType);
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
	$("#panel-primary").hide();
	var scope = this;
	$("#panel-primary").load(url, function(){
		// load complete
		$("#panel-primary").fadeIn(scope.EASING_TIME);		
	});
}

