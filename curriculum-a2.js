'use strict';
(function(root){
// Six short lessons per topic. Each row: term | meaning | example | translation.
const blocks=[
['Conhecendo pessoas',`
grew up|cresceu|I grew up in a small town.|Eu cresci em uma cidade pequena.
moved|mudou-se|We moved here last year.|Nós nos mudamos para cá no ano passado.
interested in|interessado em|I am interested in photography.|Eu tenho interesse em fotografia.
used to|costumava|I used to live near my school.|Eu costumava morar perto da minha escola.
similar|parecido|Our hobbies are quite similar.|Nossos passatempos são bastante parecidos.
keep in touch|manter contato|Let's keep in touch after the course.|Vamos manter contato depois do curso.`],
['Experiências de viagem',`
arrived|chegou|We arrived at the airport early.|Nós chegamos cedo ao aeroporto.
missed|perdeu|I missed the bus yesterday.|Eu perdi o ônibus ontem.
booked|reservou|She booked a room for two nights.|Ela reservou um quarto por duas noites.
journey|trajeto / viagem|The journey took three hours.|A viagem levou três horas.
luggage|bagagem|My luggage was heavier than yours.|Minha bagagem era mais pesada que a sua.
return ticket|passagem de volta|I would like a return ticket, please.|Eu gostaria de uma passagem de volta, por favor.`],
['Planos para o fim de semana',`
going to|vai / pretende|I am going to visit my cousins.|Eu vou visitar meus primos.
invite|convidar|Are you going to invite Ana?|Você vai convidar a Ana?
instead|em vez disso|It may rain, so let's stay home instead.|Pode chover, então vamos ficar em casa em vez disso.
picnic|piquenique|We are having a picnic on Sunday.|Nós vamos fazer um piquenique no domingo.
available|disponível|Are you available on Saturday afternoon?|Você está disponível no sábado à tarde?
cancel|cancelar|We need to cancel our plans.|Nós precisamos cancelar nossos planos.`],
['Comparando lugares',`
quieter|mais tranquilo|This street is quieter than mine.|Esta rua é mais tranquila que a minha.
crowded|lotado|The beach was very crowded yesterday.|A praia estava muito lotada ontem.
nearby|por perto|Is there a supermarket nearby?|Há um supermercado por perto?
farther|mais longe|The station is farther than the bank.|A estação fica mais longe que o banco.
safer|mais seguro|This road is safer at night.|Esta estrada é mais segura à noite.
the cheapest|o mais barato|This is the cheapest hotel in town.|Este é o hotel mais barato da cidade.`],
['Compras e devoluções',`
receipt|recibo / comprovante|I kept the receipt for these shoes.|Eu guardei o recibo destes sapatos.
refund|reembolso|Can I get a refund, please?|Posso receber um reembolso, por favor?
too small|pequeno demais|This jacket is too small for me.|Esta jaqueta é pequena demais para mim.
try on|experimentar roupa|Could I try on a larger size?|Eu poderia experimentar um tamanho maior?
discount|desconto|Is there a discount on this bag?|Há um desconto nesta bolsa?
exchange|trocar um produto|I'd like to exchange this shirt.|Eu gostaria de trocar esta camisa.`],
['Alimentação e hábitos',`
usually|geralmente|I usually eat fruit for breakfast.|Eu geralmente como fruta no café da manhã.
hardly ever|quase nunca|We hardly ever eat fast food.|Nós quase nunca comemos fast food.
enough|suficiente|There isn't enough rice for everyone.|Não há arroz suficiente para todos.
too much|demais / em excesso|There is too much sugar in this drink.|Há açúcar demais nesta bebida.
recipe|receita culinária|My aunt gave me this recipe.|Minha tia me deu esta receita.
ingredients|ingredientes|We need to buy the ingredients first.|Nós precisamos comprar os ingredientes primeiro.`],
['No restaurante',`
table for two|mesa para dois|Could we have a table for two?|Poderíamos ter uma mesa para dois?
starter|entrada|I'd like soup as a starter.|Eu gostaria de sopa como entrada.
main course|prato principal|What do you recommend for the main course?|O que você recomenda como prato principal?
without|sem|Can I have this salad without onions?|Posso pedir esta salada sem cebolas?
bill|conta|Could we have the bill, please?|Poderíamos receber a conta, por favor?
separate|separado|Can we pay with separate bills?|Podemos pagar com contas separadas?`],
['Rotinas e mudanças',`
while|enquanto|I listen to music while I cook.|Eu ouço música enquanto cozinho.
before|antes de|I take a shower before breakfast.|Eu tomo banho antes do café da manhã.
afterwards|depois disso|We had dinner and went home afterwards.|Nós jantamos e fomos para casa depois disso.
twice a week|duas vezes por semana|I go swimming twice a week.|Eu vou nadar duas vezes por semana.
less often|com menos frequência|I watch television less often now.|Eu assisto à televisão com menos frequência agora.
get ready|preparar-se|It takes me twenty minutes to get ready.|Eu levo vinte minutos para me preparar.`],
['Contando histórias',`
suddenly|de repente|Suddenly, the lights went off.|De repente, as luzes se apagaram.
at first|a princípio|At first, I didn't understand the story.|A princípio, eu não entendi a história.
then|então / depois|We ate lunch and then visited the museum.|Nós almoçamos e depois visitamos o museu.
finally|finalmente|Finally, we found the right address.|Finalmente, nós encontramos o endereço certo.
because|porque|I stayed home because I was tired.|Eu fiquei em casa porque estava cansado.
so|por isso|The shop was closed, so we went back.|A loja estava fechada, por isso nós voltamos.`],
['Trabalho e horários',`
shift|turno|My shift starts at seven tomorrow.|Meu turno começa às sete amanhã.
part-time|meio período|She works part-time in a bookshop.|Ela trabalha meio período em uma livraria.
colleague|colega de trabalho|My colleague helped me yesterday.|Meu colega de trabalho me ajudou ontem.
busy|ocupado|I was too busy to call you.|Eu estava ocupado demais para ligar para você.
day off|dia de folga|I am taking a day off on Friday.|Eu vou tirar um dia de folga na sexta-feira.
earn|ganhar dinheiro|He earns more than he did last year.|Ele ganha mais do que ganhava no ano passado.`],
['Estudos e aprendizado',`
improve|melhorar|I want to improve my listening skills.|Eu quero melhorar minha compreensão auditiva.
borrow|pegar emprestado|Could I borrow your dictionary?|Eu poderia pegar seu dicionário emprestado?
explain|explicar|Could you explain this word again?|Você poderia explicar esta palavra novamente?
mistake|erro|I made a mistake in the last exercise.|Eu cometi um erro no último exercício.
pass|ser aprovado|She studied hard and passed the test.|Ela estudou bastante e passou na prova.
homework|tarefa de casa|I finished my homework before dinner.|Eu terminei minha tarefa antes do jantar.`],
['Moradia e vizinhança',`
rent|aluguel / alugar|We rent a flat near the station.|Nós alugamos um apartamento perto da estação.
upstairs|no andar de cima|The bedroom is upstairs.|O quarto fica no andar de cima.
downstairs|no andar de baixo|We had breakfast downstairs.|Nós tomamos café no andar de baixo.
neighbour|vizinho|Our new neighbour moved in yesterday.|Nosso novo vizinho se mudou ontem.
repair|consertar|Could someone repair the kitchen window?|Alguém poderia consertar a janela da cozinha?
comfortable|confortável|This sofa is more comfortable than that one.|Este sofá é mais confortável que aquele.`],
['Saúde e cuidados cotidianos',`
sore throat|dor de garganta|I had a sore throat yesterday.|Eu tive dor de garganta ontem.
feel better|sentir-se melhor|I feel better after a good night's sleep.|Eu me sinto melhor depois de uma boa noite de sono.
should|deveria|You should tell the doctor how you feel.|Você deveria dizer ao médico como se sente.
temperature|temperatura|The nurse checked my temperature.|A enfermeira verificou minha temperatura.
appointment|consulta marcada|I'd like to make an appointment.|Eu gostaria de marcar uma consulta.
pharmacy|farmácia|Is there a pharmacy open nearby?|Há uma farmácia aberta por perto?`],
['Transporte na cidade',`
platform|plataforma|Which platform does the train leave from?|De qual plataforma o trem sai?
get off|descer do transporte|You need to get off at the next stop.|Você precisa descer na próxima parada.
change trains|trocar de trem|Do I have to change trains here?|Eu preciso trocar de trem aqui?
delayed|atrasado|Our train was delayed by ten minutes.|Nosso trem atrasou dez minutos.
traffic|trânsito|There was a lot of traffic this morning.|Havia muito trânsito esta manhã.
on foot|a pé|It is easier to go there on foot.|É mais fácil ir até lá a pé.`],
['Clima e estações',`
forecast|previsão do tempo|The forecast says it will rain tomorrow.|A previsão diz que vai chover amanhã.
windy|com vento|It was too windy to play outside.|Estava ventando demais para brincar lá fora.
warmer|mais quente|It is warmer today than yesterday.|Hoje está mais quente que ontem.
umbrella|guarda-chuva|You should take an umbrella with you.|Você deveria levar um guarda-chuva.
season|estação do ano|Spring is my favourite season.|A primavera é minha estação favorita.
cloudy|nublado|It was cloudy when we left home.|Estava nublado quando nós saímos de casa.`],
['Lazer e cultura',`
concert|show / concerto|We went to a concert last Saturday.|Nós fomos a um show no sábado passado.
exhibition|exposição|Would you like to visit the exhibition?|Você gostaria de visitar a exposição?
prefer|preferir|I prefer reading to watching television.|Eu prefiro ler a assistir à televisão.
boring|chato / entediante|The film was longer and more boring than I expected.|O filme foi mais longo e mais chato do que eu esperava.
enjoyed|gostou / aproveitou|I really enjoyed the play.|Eu gostei muito da peça.
join|juntar-se / participar|Would you like to join our book club?|Você gostaria de participar do nosso clube de leitura?`],
['Esportes e atividade física',`
practice|prática / praticar|We practice every Tuesday evening.|Nós praticamos toda terça-feira à noite.
won|venceu|Our team won the game yesterday.|Nosso time venceu o jogo ontem.
lost|perdeu|They lost the match by one point.|Eles perderam a partida por um ponto.
fit|em boa forma|I want to get fit this year.|Eu quero entrar em forma este ano.
equipment|equipamento|Do we need any special equipment?|Nós precisamos de algum equipamento especial?
take part|participar|I am going to take part in the race.|Eu vou participar da corrida.`],
['Tecnologia cotidiana',`
download|baixar arquivo|I downloaded the app yesterday.|Eu baixei o aplicativo ontem.
upload|enviar arquivo|Could you upload the photos tonight?|Você poderia enviar as fotos hoje à noite?
charger|carregador|I forgot my charger at home.|Eu esqueci meu carregador em casa.
broken|quebrado|My phone is broken, so I can't call you.|Meu telefone está quebrado, por isso não posso ligar para você.
turn on|ligar aparelho|How do I turn on this computer?|Como eu ligo este computador?
save|salvar|Remember to save your work before closing the file.|Lembre-se de salvar seu trabalho antes de fechar o arquivo.`],
['Fazendo convites',`
would you like|você gostaria|Would you like to come over for dinner?|Você gostaria de vir jantar aqui?
sounds good|parece uma boa ideia|That sounds good; what time should I arrive?|Parece uma boa ideia; a que horas devo chegar?
unfortunately|infelizmente|Unfortunately, I have to work that evening.|Infelizmente, eu preciso trabalhar naquela noite.
another time|outra ocasião|Could we meet another time?|Poderíamos nos encontrar em outra ocasião?
bring|trazer|Should I bring anything to the party?|Eu devo trazer alguma coisa para a festa?
looking forward to|ansioso por|I am looking forward to seeing you.|Eu estou ansioso para ver você.`],
['Sentimentos e opiniões',`
disappointed|decepcionado|I was disappointed with the ending.|Eu fiquei decepcionado com o final.
surprised|surpreso|She was surprised by the news.|Ela ficou surpresa com a notícia.
agree|concordar|I agree with you about the music.|Eu concordo com você sobre a música.
think|achar / pensar|I think this course is useful.|Eu acho que este curso é útil.
hope|esperar / ter esperança|I hope we can meet again soon.|Eu espero que possamos nos encontrar novamente em breve.
proud|orgulhoso|He was proud of his daughter.|Ele estava orgulhoso da filha.`],
['Organizando tarefas',`
need to|precisar fazer|We need to finish this today.|Nós precisamos terminar isto hoje.
have to|ter que|I have to leave before six.|Eu tenho que sair antes das seis.
don't have to|não precisar|You don't have to bring any food.|Você não precisa trazer comida.
list|lista|I made a list of things to do.|Eu fiz uma lista de coisas para fazer.
first|primeiro|First, we should check the address.|Primeiro, nós deveríamos conferir o endereço.
share|dividir / compartilhar|Let's share the tasks between us.|Vamos dividir as tarefas entre nós.`],
['Problemas durante uma viagem',`
lost property|achados e perdidos|Where is the lost property office?|Onde fica o setor de achados e perdidos?
stolen|roubado|My bag was stolen at the station.|Minha bolsa foi roubada na estação.
wrong|errado|I think we took the wrong bus.|Eu acho que nós pegamos o ônibus errado.
directions|orientações de caminho|Could you give me directions to the hotel?|Você poderia me dar orientações para chegar ao hotel?
check|conferir|Could you check my booking, please?|Você poderia conferir minha reserva, por favor?
helpful|prestativo / útil|The receptionist was very helpful.|A pessoa da recepção foi muito prestativa.`],
['Economia do dia a dia',`
spend|gastar|I spend less money on transport now.|Eu gasto menos dinheiro com transporte agora.
save up|juntar dinheiro|I am saving up for a new bicycle.|Eu estou juntando dinheiro para uma bicicleta nova.
afford|ter dinheiro para pagar|I can't afford a new laptop this month.|Eu não tenho dinheiro para comprar um notebook novo este mês.
price|preço|The price is higher than last week.|O preço está mais alto que na semana passada.
cash|dinheiro em espécie|Can I pay in cash?|Eu posso pagar em dinheiro?
change|troco|I think you gave me the wrong change.|Eu acho que você me deu o troco errado.`],
['Datas e compromissos',`
reschedule|remarcar|Could we reschedule our meeting?|Poderíamos remarcar nossa reunião?
until|até determinado momento|I am working until five today.|Eu estou trabalhando até as cinco hoje.
ago|atrás no tempo|We met two years ago.|Nós nos conhecemos há dois anos.
next week|semana que vem|I am going to start the course next week.|Eu vou começar o curso na semana que vem.
on time|pontualmente|The bus arrived on time today.|O ônibus chegou no horário hoje.
remind|lembrar alguém|Please remind me to call Ana.|Por favor, lembre-me de ligar para a Ana.`],
['Conversas ao telefone',`
hold on|aguardar|Could you hold on for a moment?|Você poderia aguardar um momento?
call back|ligar de volta|Can you call me back after lunch?|Você pode me ligar de volta depois do almoço?
leave a message|deixar recado|Would you like to leave a message?|Você gostaria de deixar um recado?
hear|ouvir|I can't hear you very well.|Eu não consigo ouvir você muito bem.
line|linha telefônica|The line is bad; could you speak louder?|A linha está ruim; você poderia falar mais alto?
spell|soletrar|Could you spell your surname, please?|Você poderia soletrar seu sobrenome, por favor?`]
];
const topics=blocks.map(([topic,text])=>[topic,text.trim().split('\n').map(row=>row.split('|'))]);
root.StudyA2=topics;if(typeof module!=='undefined')module.exports=topics;
})(globalThis);
