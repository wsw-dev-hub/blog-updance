(function($){

	// DEFINE BACKGROUND DO SLIDE
	(function($){
		$('.slider_item').each(function(){
			var sliderBg = $(this).attr('slider-bg');
			$(this).css({'background-image': 'url('+sliderBg+')'});
		});
	}(jQuery));


	// AVANÇA PARA O PRÓXIMO SLIDE
	var nextSlider = function(){
		if($('.playerVideos.active').next('.playerVideos').size()){

			$('.playerVideos.active').each(function(){
				$(this).next('.playerVideos').addClass('active');
				$(this).removeClass('active');
			});

		}else{
			$('.playerVideos.active').each(function(){
				$('.playerVideos').removeClass('active');
				$('.playerVideos:eq(0)').addClass('active');
			});
		}
	}

		// VOLTA PARA O SLIDE ANTERIOR
		var prevSlider = function(){
			if($('.playerVideos.active').index() > 1){
				$('.playerVideos.active').each(function(){
					$(this).prev('.playerVideos').addClass('active');
					$(this).removeClass('active');
				});

			}else{
				$('.playerVideos.active').each(function(){
					$('.playerVideos').removeClass('active');
					$('.playerVideos:last-of-type').addClass('active');
				});
			}
		}

		// INICIALIZAÇÃO AUTOMÁTICA DO SLIDE
		var sliderAuto = setInterval(nextSlider, 8000);

		$('.slider_content, .slider-next, .slider-prev').hover(function(){
			clearInterval(sliderAuto);
		},function(){
			sliderAuto = setInterval(nextSlider, 8000);			
		});

		//AÇÕES DE AVANÇAR E VOLTAR SLIDE
		$('.slider-next').click(function(event){
			event.preventDefault();
			nextSlider();
		});

		$('.slider-prev').click(function(event){
			event.preventDefault();
			prevSlider();
		});


	}(jQuery))

