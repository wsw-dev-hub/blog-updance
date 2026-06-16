// JavaScript Document
$(function(){
	document.querySelector('#screen').innerHTML = 'Total width / height: ' +window.innerWidth + ' x ' + window.innerHeight;
	
	
	
	var sessao_Intervalo = 1000;
	var sessao_expiracaoMinutos = 4;
	var sessao_avisoMinutos = 2;
	var sessao_intervaloID;
	var sessao_ultimaAtividade;

	initSession()
	function initSession() {
		sessao_ultimaAtividade = new Date();
		sessao_SetIntervalo();
		$(document).bind('keypress.session', function (ed, e) {
			sessao_TeclaPressionada(ed, e);
		});
	}

	function sessao_SetIntervalo() {
		sessao_intervaloID = setInterval(sessaoIntervalo(), sessao_Intervalo);
		console.log("passsei por aqui");
	}

	function sessao_LimpaIntervalo() {
		clearInterval(sessao_intervaloID);
		console.log("passsei por aqui");
	}

	function sessao_TeclaPressionada(ed, e) {
		sessao_ultimaAtividade = new Date();
	}

	function sessao_LogOut() {
		//window.location.href = 'Logout.aspx';
		window.location.href = 'index.aspx';
	}

    function sessaoIntervalo() {
		var now = new Date();
		//obtem a diferença de tempo em milisegundos
		var diferencaMilisegundos = now - sessao_ultimaAtividade;
		//obtem o tempo em minutos
		var diferencaMinutos = (diferencaMilisegundos / 1000 / 60);
		//console.log(now);
		result = sessao_expiracaoMinutos - sessao_avisoMinutos;
		
		tempo = Math.round((result - diferencaMinutos) * 60);
		minutos = Math.round(diferencaMinutos * 60);
		
		tempo = formatarCronometro(tempo);
		minutos = formatarCronometro(minutos);
		
		document.getElementById('data-hoje').innerHTML = "CRONÔMETRO: " + tempo;
		
		//console.log(diferencaMinutos * 60);
		document.getElementById('txt').innerHTML = "VALOR EM SEGUNDOS: " + minutos;
		
		
		console.log(diferencaMinutos +'x' +sessao_avisoMinutos);
		
		
		if (diferencaMinutos >= sessao_avisoMinutos) 
		{
			//emite o aviso de expiração
			//para o timer
			sessao_LimpaIntervalo();
			//mensagem de alerta
			var ativar = confirm('A sua sessão irá experir em ' + (sessao_expiracaoMinutos - sessao_avisoMinutos) +
			' minutos (de ' + now.toTimeString() + '), pressione OK para permanecer logado ' +
			'ou pressione Cancel para fazer o log off. \nAo se desconetar seus dados da sessão serão perdidos.');
			
			if (ativar == true) {
				now = new Date();
				diferencaMilisegundos = now - sessao_ultimaAtividade;
				diferencaMinutos = (diferencaMilisegundos / 1000 / 60);
				
				console.log(diferencaMinutos);

				if (diferencaMinutos > sessao_expiracaoMinutos) {
					
					console.log(diferencaMinutos);
					sessao_LogOut();
				}
				else {
					initSession();
					sessao_SetIntervalo();
					sessao_ultimaAtividade = new Date();
					
					console.log(diferencaMinutos);
				}
			}
			else {
				sessao_LogOut();
			}
		}
	}
		
	function formatarCronometro(s){
		function duas_casas(numero){
			if(numero <= 9){
				numero = "0"+ numero;
			}
			return numero;
		}
		hora = duas_casas(parseInt(s/3600));
		minuto = duas_casas(parseInt((s%3600)/60));
		segundo = duas_casas((s%3600)%60);
		
		hora = hora % 60;
		minuto = minuto % 60;
		segundo = segundo % 60;
		
		if( hora <= 9){ hora = "0" + hora; }
		if( minuto <= 9){ minuto = "0" + minuto; }
		if( segundo <= 9 ){ segundo = "0" + segundo; }
		
		if((hora == 00) || (hora == null) ||(hora == undefined)){
			formatado = " "+minuto+":"+segundo+" ";
		}else{
			formatado = " "+hora+":"+minuto+":"+segundo+" ";
		}
		return formatado;
	}
});