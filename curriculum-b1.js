'use strict';
(function(root){
const blocks=[
['Experiências pessoais',`
ever|alguma vez|Have you ever worked in another country?|Você já trabalhou em outro país alguma vez?
recently|recentemente|I've recently started learning to cook.|Eu comecei a aprender a cozinhar recentemente.
since|desde|I've lived here since I finished school.|Eu moro aqui desde que terminei a escola.
for a while|por um tempo|We haven't seen each other for a while.|Nós não nos vemos há algum tempo.
so far|até agora|The course has been useful so far.|O curso tem sido útil até agora.
achievement|conquista|Finishing the course was an important achievement for me.|Terminar o curso foi uma conquista importante para mim.`],
['Narrativas e imprevistos',`
while|enquanto|While I was waiting for the bus, I saw an old friend.|Enquanto eu esperava o ônibus, vi um velho amigo.
by the time|quando / até o momento em que|By the time we arrived, the concert had started.|Quando nós chegamos, o show já tinha começado.
realised|percebeu|I realised that I had left my keys at home.|Eu percebi que tinha deixado minhas chaves em casa.
unexpectedly|inesperadamente|The trip ended unexpectedly when our car broke down.|A viagem terminou inesperadamente quando nosso carro quebrou.
eventually|por fim|After several attempts, we eventually found the address.|Depois de várias tentativas, nós finalmente encontramos o endereço.
fortunately|felizmente|Fortunately, a neighbour offered to help us.|Felizmente, um vizinho se ofereceu para nos ajudar.`],
['Opiniões e justificativas',`
in my opinion|na minha opinião|In my opinion, public transport should be cheaper.|Na minha opinião, o transporte público deveria ser mais barato.
although|embora|Although the tickets were expensive, the show was worth it.|Embora os ingressos fossem caros, o show valeu a pena.
however|no entanto|The job pays well; however, the journey is very long.|O emprego paga bem; no entanto, o trajeto é muito longo.
main reason|principal motivo|The main reason I moved was to be closer to my family.|O principal motivo da minha mudança foi ficar mais perto da minha família.
worth|valer a pena|I think this museum is worth visiting.|Eu acho que vale a pena visitar este museu.
point of view|ponto de vista|I understand your point of view, but I disagree.|Eu entendo seu ponto de vista, mas discordo.`],
['Escolhas e consequências',`
if|se|If it rains tomorrow, we'll move the picnic indoors.|Se chover amanhã, nós faremos o piquenique em um espaço fechado.
unless|a menos que|We won't finish on time unless everyone helps.|Nós não terminaremos no prazo a menos que todos ajudem.
as long as|desde que|You can borrow my bike as long as you bring it back tonight.|Você pode pegar minha bicicleta emprestada desde que a devolva hoje à noite.
otherwise|caso contrário|We should leave now; otherwise, we'll miss the train.|Nós deveríamos sair agora; caso contrário, perderemos o trem.
would|iria / faria em hipótese|If I had more time, I would learn another language.|Se eu tivesse mais tempo, aprenderia outro idioma.
instead of|em vez de|We decided to walk instead of taking a taxi.|Nós decidimos caminhar em vez de pegar um táxi.`],
['Carreira e entrevistas',`
apply for|candidatar-se a|I've decided to apply for a job at the library.|Eu decidi me candidatar a um emprego na biblioteca.
experience|experiência|I have three years of experience working with customers.|Eu tenho três anos de experiência trabalhando com clientes.
strength|ponto forte|One of my strengths is staying calm under pressure.|Um dos meus pontos fortes é manter a calma sob pressão.
responsible for|responsável por|I was responsible for training new staff.|Eu era responsável por treinar funcionários novos.
challenge|desafio|The biggest challenge was learning to manage my time.|O maior desafio foi aprender a administrar meu tempo.
opportunity|oportunidade|This role would give me an opportunity to develop new skills.|Este cargo me daria uma oportunidade de desenvolver novas habilidades.`],
['Colaboração no trabalho',`
deadline|prazo final|We need to agree on a realistic deadline.|Nós precisamos combinar um prazo realista.
priority|prioridade|Our first priority is to solve the customer's problem.|Nossa primeira prioridade é resolver o problema do cliente.
suggest|sugerir|I suggest discussing the plan before we start.|Eu sugiro discutir o plano antes de começarmos.
take over|assumir uma tarefa|Could you take over this task while I'm away?|Você poderia assumir esta tarefa enquanto eu estiver fora?
progress|progresso|We've made good progress, but there is still work to do.|Nós avançamos bem, mas ainda há trabalho a fazer.
feedback|comentários de avaliação|Your feedback helped me improve the presentation.|Seus comentários me ajudaram a melhorar a apresentação.`],
['Estudo e estratégias',`
keep up with|acompanhar|It's difficult to keep up with the course when I miss lessons.|É difícil acompanhar o curso quando perco aulas.
revise|revisar conteúdo|I usually revise by explaining ideas to a friend.|Eu geralmente reviso explicando ideias a um amigo.
concentrate|concentrar-se|I find it easier to concentrate in a quiet room.|Eu acho mais fácil me concentrar em uma sala silenciosa.
set a goal|definir uma meta|I've set a goal of reading one article every day.|Eu defini a meta de ler um artigo todos os dias.
improvement|melhoria|I've noticed an improvement in my writing.|Eu percebi uma melhoria na minha escrita.
give up|desistir|I nearly gave up, but my teacher encouraged me to continue.|Eu quase desisti, mas meu professor me incentivou a continuar.`],
['Viagens e planejamento',`
accommodation|hospedagem|We should book accommodation before buying the tickets.|Nós deveríamos reservar hospedagem antes de comprar os ingressos.
itinerary|roteiro|Our itinerary includes two days in the countryside.|Nosso roteiro inclui dois dias no interior.
travel insurance|seguro viagem|Does your travel insurance cover a cancelled flight?|Seu seguro viagem cobre um voo cancelado?
fully booked|com reservas esgotadas|The hotel was fully booked, so we looked for another one.|O hotel estava lotado, então nós procuramos outro.
off the beaten track|fora dos roteiros habituais|I'd like to visit somewhere off the beaten track.|Eu gostaria de visitar algum lugar fora dos roteiros habituais.
get around|deslocar-se|What's the easiest way to get around without a car?|Qual é a maneira mais fácil de se deslocar sem carro?`],
['Reclamações e soluções',`
faulty|com defeito|The headphones were faulty when I opened the box.|Os fones estavam com defeito quando abri a caixa.
replace|substituir|Could you replace the item rather than repair it?|Você poderia substituir o produto em vez de consertá-lo?
complaint|reclamação|I'd like to make a complaint about the delivery.|Eu gostaria de fazer uma reclamação sobre a entrega.
reasonable|razoável|I think a refund would be a reasonable solution.|Eu acho que um reembolso seria uma solução razoável.
inconvenience|inconveniência / transtorno|The delay caused a lot of inconvenience.|O atraso causou muitos transtornos.
sort out|resolver|Could you tell me how we can sort out this problem?|Você poderia me dizer como podemos resolver este problema?`],
['Amizades e convivência',`
get along with|dar-se bem com|I get along with my flatmates most of the time.|Eu me dou bem com meus colegas de apartamento na maior parte do tempo.
fall out|desentender-se|We fell out because we hadn't discussed the rules.|Nós nos desentendemos porque não tínhamos discutido as regras.
rely on|contar com|It's important to have friends you can rely on.|É importante ter amigos com quem você pode contar.
apologise|pedir desculpas|I apologised for forgetting her birthday.|Eu pedi desculpas por esquecer o aniversário dela.
make up|fazer as pazes|We talked about what happened and decided to make up.|Nós conversamos sobre o ocorrido e decidimos fazer as pazes.
compromise|chegar a um acordo|We need to compromise on how we share the kitchen.|Nós precisamos chegar a um acordo sobre como dividimos a cozinha.`],
['Moradia e comunidade',`
affordable|acessível financeiramente|It's getting harder to find affordable housing here.|Está ficando mais difícil encontrar moradia acessível aqui.
facilities|instalações / serviços disponíveis|The neighbourhood has good facilities for families.|O bairro tem boas instalações e serviços para famílias.
landlord|proprietário que aluga imóvel|Our landlord said the heating would be repaired tomorrow.|O proprietário disse que o aquecimento seria consertado amanhã.
maintenance|manutenção|Regular maintenance can prevent more serious problems.|A manutenção regular pode evitar problemas mais sérios.
community|comunidade|The community organised an event to welcome new residents.|A comunidade organizou um evento para receber novos moradores.
take care of|cuidar de|Who will take care of the garden while we're away?|Quem vai cuidar do jardim enquanto estivermos fora?`],
['Bem-estar e hábitos',`
cut down on|reduzir o consumo de|I'm trying to cut down on sugary drinks.|Eu estou tentando reduzir o consumo de bebidas açucaradas.
routine|rotina|A regular routine helps me sleep better.|Uma rotina regular me ajuda a dormir melhor.
stressful|estressante|Moving house can be stressful, even when it's exciting.|Mudar de casa pode ser estressante, mesmo quando é empolgante.
balance|equilíbrio|I want to find a better balance between work and rest.|Eu quero encontrar um equilíbrio melhor entre trabalho e descanso.
take a break|fazer uma pausa|You could take a break before starting the next task.|Você poderia fazer uma pausa antes de começar a próxima tarefa.
support|apoio|Asking for support helped me deal with a difficult week.|Pedir apoio me ajudou a lidar com uma semana difícil.`],
['Meio ambiente',`
recycle|reciclar|More people would recycle if the bins were easier to find.|Mais pessoas reciclariam se as lixeiras fossem mais fáceis de encontrar.
reduce|reduzir|We can reduce waste by buying only what we need.|Nós podemos reduzir o desperdício comprando apenas o necessário.
reusable|reutilizável|I started carrying a reusable bottle to work.|Eu comecei a levar uma garrafa reutilizável para o trabalho.
pollution|poluição|Air pollution is a problem in many large cities.|A poluição do ar é um problema em muitas cidades grandes.
protect|proteger|The project aims to protect the local forest.|O projeto busca proteger a floresta local.
make a difference|fazer diferença|Small changes can make a difference over time.|Pequenas mudanças podem fazer diferença ao longo do tempo.`],
['Tecnologia e comunicação',`
keep track of|acompanhar / monitorar|This app helps me keep track of my study time.|Este aplicativo me ajuda a acompanhar meu tempo de estudo.
back up|fazer cópia de segurança|You should back up your files before changing computers.|Você deveria fazer uma cópia de segurança dos arquivos antes de trocar de computador.
set up|configurar|It took me an hour to set up the new printer.|Eu levei uma hora para configurar a impressora nova.
connection|conexão|The connection kept dropping during our meeting.|A conexão ficava caindo durante nossa reunião.
privacy|privacidade|I check the privacy settings before sharing photos.|Eu confiro as configurações de privacidade antes de compartilhar fotos.
reliable|confiável|We need a reliable way to communicate when we're travelling.|Nós precisamos de uma maneira confiável de nos comunicar quando viajamos.`],
['Notícias e informação',`
headline|manchete|The headline made the story sound more dramatic.|A manchete fez a história parecer mais dramática.
source|fonte|I usually check the source before sharing an article.|Eu geralmente confiro a fonte antes de compartilhar um artigo.
report|relato / notícia|According to the report, the bridge will open next month.|Segundo a notícia, a ponte será aberta no mês que vem.
claim|afirmação / alegar|The article claims that the project will create new jobs.|O artigo afirma que o projeto vai criar empregos novos.
evidence|evidência|Is there any evidence to support that claim?|Há alguma evidência que sustente essa afirmação?
misleading|enganoso|The photo was misleading because it was taken years ago.|A foto era enganosa porque tinha sido tirada anos atrás.`],
['Filmes e livros',`
plot|enredo|The plot was simple, but the characters were interesting.|O enredo era simples, mas os personagens eram interessantes.
character|personagem|The main character learns to trust other people.|O personagem principal aprende a confiar nas outras pessoas.
set in|ambientado em|The novel is set in a small coastal town.|O romance é ambientado em uma pequena cidade litorânea.
ending|final|I won't tell you the ending because it would spoil the story.|Eu não vou contar o final porque isso estragaria a história.
recommend|recomendar|I'd recommend this book to anyone who enjoys mysteries.|Eu recomendaria este livro a quem gosta de mistérios.
based on|baseado em|The film is based on a true story.|O filme é baseado em uma história real.`],
['Dinheiro e prioridades',`
budget|orçamento|We made a budget before planning the holiday.|Nós fizemos um orçamento antes de planejar as férias.
expense|despesa|Transport is my biggest monthly expense.|O transporte é minha maior despesa mensal.
cut back|reduzir gastos|We decided to cut back on eating out.|Nós decidimos reduzir os gastos com refeições fora de casa.
value for money|boa relação custo-benefício|The room was small, but it offered good value for money.|O quarto era pequeno, mas oferecia boa relação custo-benefício.
unexpected cost|custo inesperado|An unexpected cost meant we had to change our plans.|Um custo inesperado fez com que tivéssemos de mudar nossos planos.
put aside|reservar dinheiro|I try to put aside a little money each month.|Eu tento reservar um pouco de dinheiro todo mês.`],
['Decisões e planos futuros',`
intend to|pretender|I intend to continue studying after this course.|Eu pretendo continuar estudando depois deste curso.
consider|considerar|I'm considering moving closer to my workplace.|Eu estou considerando me mudar para mais perto do trabalho.
likely|provável|It's likely that we'll need more time.|É provável que nós precisemos de mais tempo.
in case|para o caso de|I'll bring a jacket in case it gets cold.|Eu vou levar uma jaqueta para o caso de esfriar.
make up my mind|decidir-me|I haven't made up my mind about the trip yet.|Eu ainda não me decidi sobre a viagem.
work out|dar certo|I hope everything works out with your new job.|Eu espero que tudo dê certo com seu emprego novo.`],
['Regras e responsabilidades',`
allowed to|ter permissão para|Are visitors allowed to use the gym?|Os visitantes têm permissão para usar a academia?
mustn't|não poder / proibição|You mustn't leave bags in front of the exit.|Você não pode deixar bolsas em frente à saída.
supposed to|dever fazer / esperado|We're supposed to return the keys before noon.|Nós devemos devolver as chaves antes do meio-dia.
permission|permissão|Do we need permission to take photographs here?|Nós precisamos de permissão para tirar fotos aqui?
required|obrigatório / exigido|A ticket is required to enter the exhibition.|É obrigatório ter ingresso para entrar na exposição.
respect|respeitar|Everyone should respect the shared spaces.|Todos deveriam respeitar os espaços compartilhados.`],
['Eventos e organização',`
arrange|organizar / combinar|We've arranged for a local band to play at the event.|Nós combinamos com uma banda local para tocar no evento.
volunteer|voluntário|Several volunteers offered to help with the food.|Vários voluntários se ofereceram para ajudar com a comida.
postpone|adiar|We may have to postpone the event if it rains.|Nós talvez tenhamos de adiar o evento se chover.
attend|comparecer|How many people are planning to attend the meeting?|Quantas pessoas pretendem comparecer à reunião?
in charge of|encarregado de|Who is in charge of welcoming the guests?|Quem está encarregado de receber os convidados?
run out of|ficar sem|We ran out of chairs before everyone arrived.|Nós ficamos sem cadeiras antes de todos chegarem.`],
['Diferenças culturais',`
custom|costume cultural|It's a local custom to bring food when visiting friends.|É um costume local trazer comida ao visitar amigos.
polite|educado / cortês|What's a polite way to refuse an invitation here?|Qual é uma maneira educada de recusar um convite aqui?
unfamiliar|desconhecido / pouco familiar|The food seemed unfamiliar at first, but I enjoyed it.|A comida parecia pouco familiar a princípio, mas eu gostei dela.
adapt|adaptar-se|It took me a few months to adapt to the new routine.|Eu levei alguns meses para me adaptar à rotina nova.
assume|supor|We shouldn't assume that everyone follows the same customs.|Nós não deveríamos supor que todos seguem os mesmos costumes.
ask about|perguntar sobre|I asked about the tradition instead of guessing its meaning.|Eu perguntei sobre a tradição em vez de adivinhar seu significado.`],
['Resolvendo problemas',`
deal with|lidar com|How would you deal with a delayed delivery?|Como você lidaria com uma entrega atrasada?
option|opção|One option is to ask for a different delivery date.|Uma opção é pedir uma data de entrega diferente.
advantage|vantagem|The main advantage of this plan is its flexibility.|A principal vantagem deste plano é sua flexibilidade.
disadvantage|desvantagem|A disadvantage is that it might cost more.|Uma desvantagem é que ele pode custar mais.
reach an agreement|chegar a um acordo|We managed to reach an agreement after discussing both options.|Nós conseguimos chegar a um acordo depois de discutir as duas opções.
find out|descobrir|Let's find out what caused the problem before changing the plan.|Vamos descobrir o que causou o problema antes de mudar o plano.`],
['Conversas e esclarecimentos',`
what do you mean|o que você quer dizer|What do you mean when you say the plan is flexible?|O que você quer dizer quando fala que o plano é flexível?
as far as I know|até onde eu sei|As far as I know, the office is closed tomorrow.|Até onde eu sei, o escritório está fechado amanhã.
let me check|deixe-me conferir|Let me check that I've understood your suggestion.|Deixe-me conferir se entendi sua sugestão.
in other words|em outras palavras|In other words, we need to start earlier.|Em outras palavras, nós precisamos começar mais cedo.
go on|continuar a falar|Please go on; I'd like to hear the rest of the story.|Por favor, continue; eu gostaria de ouvir o resto da história.
bring up|mencionar um assunto|I'd like to bring up one more point before we finish.|Eu gostaria de mencionar mais um ponto antes de terminarmos.`],
['Mudanças e memória',`
used to|costumava|We used to spend every summer at my grandparents' house.|Nós costumávamos passar todo verão na casa dos meus avós.
no longer|não mais|The old cinema is no longer open.|O cinema antigo não está mais aberto.
get used to|acostumar-se a|I'm getting used to travelling to work by train.|Eu estou me acostumando a ir ao trabalho de trem.
remind me of|fazer-me lembrar de|This song reminds me of my first trip abroad.|Esta música me faz lembrar da minha primeira viagem ao exterior.
look back|olhar para o passado|When I look back, I'm glad I tried something new.|Quando olho para o passado, fico feliz por ter tentado algo novo.
over the years|ao longo dos anos|The neighbourhood has changed a lot over the years.|O bairro mudou muito ao longo dos anos.`],
['Objetivos e motivação',`
make an effort|fazer um esforço|I'm making an effort to speak English outside class.|Eu estou fazendo um esforço para falar inglês fora da aula.
encourage|incentivar|My friends encouraged me to join the course.|Meus amigos me incentivaram a participar do curso.
step by step|passo a passo|It's easier to reach a big goal step by step.|É mais fácil alcançar uma meta grande passo a passo.
confidence|confiança|Practising regularly has helped me build confidence.|Praticar regularmente me ajudou a desenvolver confiança.
be willing to|estar disposto a|I'm willing to make mistakes if they help me learn.|Eu estou disposto a cometer erros se eles me ajudarem a aprender.
keep going|continuar / persistir|Even when progress seems slow, it's important to keep going.|Mesmo quando o progresso parece lento, é importante continuar.`]
];
const topics=blocks.map(([topic,text])=>[topic,text.trim().split('\n').map(row=>row.split('|'))]);
root.StudyB1=topics;if(typeof module!=='undefined')module.exports=topics;
})(globalThis);
