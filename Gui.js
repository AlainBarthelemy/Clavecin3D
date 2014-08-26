
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
    var scope = this;	
	$(window).load(function() {
		scope.addEventsListeners();
	});
	
}

GUI.prototype.addEventsListeners = function(){
	var scope = this;
	$('#folder-toggle-btn').click(function () {
		$("#folder-toggle-btn > .glyphicon").toggleClass("glyphicon-chevron-up");
		$("#folder-toggle-btn > .glyphicon").toggleClass("glyphicon-chevron-down");
	});
	$('#close-btn').click(function () {
		scope.closePanel($('#main-panel'));
	});
	
	$('#zoom-in-btn').click(function () {
		scope.emitEvent(scope.events.zoomIn);
	});
	$('#zoom-out-btn').click(function () {
		scope.emitEvent(scope.events.zoomOut);
	});
	$('#move-btn').click(function () {
	
		if(! $('#move-btn').hasClass("btn-primary")){
			$('#rotate-btn').removeClass("btn-primary");
			$('#rotate-btn').addClass("btn-default");
			$('#move-btn').addClass("btn-primary");
			$('#move-btn').removeClass("btn-default");
			
			scope.emitEvent(scope.events.setPanMode);	
		}
				
	});
	$('#rotate-btn').click(function () {
		
		
			
		if(! $('#rotate-btn').hasClass("btn-primary")){
			$('#move-btn').removeClass("btn-primary");
			$('#move-btn').addClass("btn-default");
			$('#rotate-btn').addClass("btn-primary");
			$('#rotate-btn').removeClass("btn-default");
			
			scope.emitEvent(scope.events.setRotateMode);
		}
	});	
	$('#view-one-btn').click(function () {
		scope.emitEvent(scope.events.viewOne);
	});
	$('#view-two-btn').click(function () {
		scope.emitEvent(scope.events.viewTwo);
	});
	$('#view-three-btn').click(function () {
		scope.emitEvent(scope.events.viewThree);
	});
};

GUI.prototype.closePanel = function(element){
	element.hide();	
}

GUI.prototype.emitEvent = function(eventType,eventData){
	var event = new Event(eventType);
	document.dispatchEvent(event);
};

