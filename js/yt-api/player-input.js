// JavaScript Document

// 1 

	var usedColor = 'rgb(50, 0, 0)';
	var range = document.getElementById('volume');
	var currentValue =
	  ((range.value - range.min) / (range.max - range.min)) * range.max;

	var updateBackgroundColor = (value, color) => {
	  range.style.setProperty(
		'background',
		`linear-gradient(to right,  ${color} 0%,  ${color} 
		 ${value}%,
		 #fff ${value}%, 
		 #fff 100%)`,
	  );
	};

	updateBackgroundColor(currentValue, usedColor);

	range.addEventListener('input', function () {
	  // retorna o valor atual do seletor
	  var updatedValue =
		((this.value - this.min) / (this.max - this.min)) * this.max;

	  // chama a função que atualiza o background
	  updateBackgroundColor(updatedValue, usedColor);
	});

