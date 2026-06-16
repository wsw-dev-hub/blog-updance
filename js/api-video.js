// JavaScript Document
$(function(){
	
	// Adicionando o script do youtube iframe
	var tag = document.createElement('script');
	var firstScriptTag = document.getElementsByTagName('script')[0];
	
	tag.src = 'https://www.youtube.com/iframe_api';
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	
	// Nas inicializações das variáveis, adicione mais estas: videoDuration, videoTime e interval
    // O container do video
	var playerDiv = $('#player');
    // inicializando o player
	var player = null;
	//inicializa o tempo de duração do vídeo
	var videoDuration = 0;
    // inicializando o contador do tempo do video
    var videotime = 0;
    // inicializando intervalo
    var interval = null;

	//Inicia a legenda a ser apresentada durante a execução do player
	var lyrics = {
		2: 'And so I cry sometimes When I\'m lying in bed just to get it all out',
		7: 'What\'s in my head',
		10: 'And I, I am feeling a little peculiar',
		16: 'And so I wake in the morning',
		18: 'And I step outside',
		19: 'And I take a deep breath and I get real high',
		23: 'And I scream from the top of my lungs',
		25: 'What\'s going on?',
		29: 'And I say, hey yeah yeah, hey yeah yeah',
		36: 'I said hey, what\'s going on?',
		43: 'And I say, hey yeah yeah, hey yeah yeah',
		49: 'I said hey, what\'s going on?',
		57: 'And he tries, oh my god do I try',
		62: 'I try all the time, in this institution',
		70: 'And heeeee prays, oh my god do I pray',
		76: 'I pray every single day',
		80: 'For a revolution',
		85: 'And I say, hey yeah yeah, hey yeah yeah',
		91: 'I said hey, what\'s going on?',
		100: 'Chega... dá trabalho demais sincronizar'
	};
	
	// método chamado automaticamente pela API do Youtube
	function onYouTubeIframeAPIReady() {
		player = new YT.Player('player', {
			//height: 450, // qualquer altura desejada
			//width: 800, // qualquer largura desejada
			videoId: $(playerDiv).attr('data-vide-id'),
			// nas configurações do player adicione a configuração de eventos
			// playersVars: {...},
			events: {
				'onReady': onPlayerReady
				//'onStateChange': onPlayerStateChange
			},
			playerVars: { // adicionando algumas variáveis
				rel: 0, // não exibir videos relacionados ao final
				showinfo: 0, // ocultar informações do video
				autoplay: 1 // play automático
			}
		});
	}
	
	
	// Método chamado nos eventos do player
    function onPlayerReady(event) {
        // obtendo a duração do video, em segundos
        videoDuration = parseInt(player.getDuration());

        // aplicando o intervalo de 1 em 1 segundo
        interval = setInterval(discoverTime, 1000);
    }

    // método utilizado para descobrir o tempo atual do vídeo
    function discoverTime() {
        if (player && player.getCurrentTime) {
            videotime = parseInt(player.getCurrentTime());
        }

        if (videotime < videoDuration && lyrics[videotime] !== undefined) {
            fireEvent(videotime);
        }

        if (videotime >= videoDuration) {
            clearInterval(interval);
        }
    }

	// Método chamado nos eventos para saber quando o vídeo chegou ao fim
	function onPlayerStateChange(event) {
    switch (event.data) {
        case YT.PlayerState.ENDED:
            console.log('Finalizou execução do video');
            break;
        case YT.PlayerState.PLAYING:
            console.log('Assistindo');
            break;
        case YT.PlayerState.PAUSED:
            console.log('Pause');
            break;
        case YT.PlayerState.BUFFERING:
            console.log('carregando');
            break;
    	}
	}

    // Aqui vem sua lógica para que algo seja feito ao atingir o tempo desejado no video
    function fireEvent(index) {
        console.log(lyrics[index]);
    }
	
});