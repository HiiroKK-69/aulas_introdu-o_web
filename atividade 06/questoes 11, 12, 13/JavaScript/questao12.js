let desc,valor, valorfinal;

valor = Number(prompt("insira o valor do produto"));
desc = Number(prompt("insira a porcentagem de desconto do produto"));

valorfinal =  valor - (valor * (desc /100));

document.writeln(`o valor final do produto e de ${valorfinal}R$`);
