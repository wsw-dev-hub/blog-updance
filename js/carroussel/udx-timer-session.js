
$(function() {
    timeout = setTimeout(function() {
        //window.location.href = "http://pt.stackoverflow.com";
		console.log('saindo da página');
		
    }, 120000);
	
	interval = setInterval(discoverTime, 1000);
	
});


function ContarSegundos(){
    var segundos = 1;
	console.log("Já passou " + segundos +" segundos...");
    //document.Writeln("Já passou " + segundos +" segundos...");
}
setInterval(ContarSegundos, 1000);


$(document).on('click', function() {
    if (timeout !== null) { 
        clearTimeout(timeout);
    }
    timeout = setTimeout(function() {
		console.log('saindo da página');
        //window.location.href = "http://pt.stackoverflow.com";
    }, 120000);
});



