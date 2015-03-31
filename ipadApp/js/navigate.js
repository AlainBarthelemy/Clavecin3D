
//HOMA PAGE
$('#homeimage').mousedown(function(e){ 
	$('#homeimage').addClass('closed');
});

//VIEW LAYER
$('#viewLayer').mousedown(function(e){ 
	$('#sidebar').addClass('closed');
	$('#helpwin').addClass('closed');
});


//MENU TOGGLE
$('#menubutton').mousedown( function() { 
	$('#sidebar').toggleClass('closed'); 
	$('#helpwin').addClass('closed');
});

//DIAPORAMA
var diapo = 0;
lockdiapo = false;
movediapo = false;
$('#diapocontainer').mousedown( function(e) { 
	if (diapo > 1) movediapo = getPos(e);
	else diapoload('next');
 });

$('#diapocontainer').mousemove( function(e) { 
	
	if (!movediapo || lockdiapo) return;

	var diff = Math.abs(getPos(e).x - movediapo.x);
	if (diff > 50)
	{
		if (getPos(e).x < movediapo.x) 
		{
			movediapo = false;
			diapoload('next');
		}
		else
		{
			movediapo = false;
			diapoload('prev');
		}
	}

 });
$('#diapocontainer').mouseup( function(e) { 
	movediapo = false;
 });

function diapoload(way)
{
	$('#sidebar').addClass('closed');
	$('#helpwin').addClass('closed');

	if (way == 'next') diapo++;
	else if (way == 'prev' && diapo > 1) diapo--;
	else return;

	if (lockdiapo) return;
	lockdiapo = true;

	//first one :: load it and show :: reset if empty
	if (!$("#diapocontent"+(diapo%3)).html())
	{
		$("#diapocontent"+(diapo%3)).load('./data/'+ipad+'/diaporama.html?'+drawer.cache+' #diapo'+diapo, function() { 
			if ($("#diapocontent"+(diapo%3)).html())
				$("#diapocontent"+(diapo%3)+" > div > .diapositive").addClass('opened');
			
			//end of diapo
			else 
			{
				diapo = 0;
				$(".linkCredits").mousedown();
			}
		});
	}

	//not the first one, supposed to be ready :: switch show
	else
	{
		$("#diapocontent"+(diapo%3)).css('z-index', 22);
		$("#diapocontent"+(diapo%3)+" > div > .diapositive").addClass('opened');

		if (way == 'next')
		{	
			$("#diapocontent"+((diapo-1)%3)).css('z-index', 24);
			$("#diapocontent"+((diapo-1)%3)+" > div > .diapositive").removeClass('opened');
		}
		else if (way == 'prev')
		{
			$("#diapocontent"+((diapo+1)%3)).css('z-index', 24);
			$("#diapocontent"+((diapo+1)%3)+" > div > .diapositive").removeClass('opened');
		}	
	}

	//load next and previous diapo
	setTimeout(function() {
		if (way == 'next') $("#diapocontent"+((diapo+1)%3)).load('./data/'+ipad+'/diaporama.html?'+drawer.cache+' #diapo'+(diapo+1));
		if (way == 'prev') $("#diapocontent"+((diapo-1)%3)).load('./data/'+ipad+'/diaporama.html?'+drawer.cache+' #diapo'+(diapo-1));
		setTimeout(function() {lockdiapo = false;}, 200);
	}, 200);

}

$('#creditscontainer').mousedown( function() { 
	drawer.source = 2;
	$("#resetbtn").mousedown();
});

//HELP
$('#helpwin').mousedown( function() { $('#helpwin').toggleClass('closed');  });

//INFO
$('#infowin').mousedown( function() { $('#infowin').addClass('closed');  });

//LINKS
$('#homelink').mouseup(function() { location.reload(); });


