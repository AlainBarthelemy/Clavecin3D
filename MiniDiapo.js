function MiniDiapo(){
	this.diapoPeriod = 1000;
	this.currentIndex = 0;
	this.diapos = [
		"contents/resto/diapo/fondpanneaux0.jpg",
		"contents/resto/diapo/fondpanneaux1.jpg",
		"contents/resto/diapo/fondpanneaux2.jpg",
		"contents/resto/diapo/fondpanneaux3.jpg",
		"contents/resto/diapo/fondpanneaux4.jpg",
		"contents/resto/diapo/fondpanneaux5.jpg",
		"contents/resto/diapo/fondpanneaux6.jpg",
		"contents/resto/diapo/fondpanneaux7.jpg",
	];
	this.populate();
}

MiniDiapo.prototype.populate = function(){
	$("#miniDiapo").empty();
	for(var k=0;k<this.diapos.length;k++)
		$("#miniDiapo").append('<img src="'+this.diapos[k]+'">');	
}

MiniDiapo.prototype.start = function(){
	var self = this;
	this.intervalHandler = setInterval(function(){
			self.nextDiapo();
	},this.diapoPeriod);
}

MiniDiapo.prototype.stop = function(){
	clearInterval(this.intervalHandler);	
}

MiniDiapo.prototype.show = function(){
	$("#miniDiapo img").fadeOut();
	var check = $("#miniDiapo img");
	$($("#miniDiapo img")[this.currentIndex]).fadeIn();
}

MiniDiapo.prototype.hide = function(){
	$("#miniDiapo img").fadeOut();
}
MiniDiapo.prototype.nextDiapo = function(){
	$("#miniDiapo img").fadeOut();
	$($("#miniDiapo img")[this.currentIndex]).fadeIn();
	this.currentIndex++;
}
