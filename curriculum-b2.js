'use strict';
(function(root){
const blocks=[
['Argumentos e contrapontos',`
nevertheless|ainda assim|The proposal is expensive; nevertheless, it may save money in the long term.|A proposta é cara; ainda assim, pode economizar dinheiro no longo prazo.
whereas|enquanto que|Some people prefer working alone, whereas others benefit from collaboration.|Algumas pessoas preferem trabalhar sozinhas, enquanto outras se beneficiam da colaboração.
despite|apesar de|Despite the initial difficulties, the project was completed on time.|Apesar das dificuldades iniciais, o projeto foi concluído no prazo.
to some extent|até certo ponto|I agree with the criticism to some extent, but the situation is more complex.|Eu concordo com a crítica até certo ponto, mas a situação é mais complexa.
on balance|considerando tudo|On balance, the benefits seem to outweigh the disadvantages.|Considerando tudo, os benefícios parecem superar as desvantagens.
counterargument|contra-argumento|A convincing counterargument should address the strongest opposing point.|Um contra-argumento convincente deveria abordar o argumento contrário mais forte.`],
['Negociação e acordos',`
trade-off|compensação entre vantagens e perdas|There is a trade-off between a lower price and faster delivery.|Há uma compensação entre um preço menor e uma entrega mais rápida.
meet halfway|chegar a um meio-termo|If we both adjust our expectations, we could meet halfway.|Se ambos ajustarmos nossas expectativas, poderíamos chegar a um meio-termo.
flexible|flexível|We can be flexible about the date, provided that the quality remains the same.|Podemos ser flexíveis quanto à data, desde que a qualidade continue a mesma.
terms|condições de um acordo|We should clarify the terms before making a final commitment.|Nós deveríamos esclarecer as condições antes de assumir um compromisso definitivo.
mutually beneficial|benéfico para ambas as partes|The aim is to reach a mutually beneficial agreement.|O objetivo é chegar a um acordo benéfico para ambas as partes.
concession|concessão|We offered a small concession in exchange for a longer contract.|Nós oferecemos uma pequena concessão em troca de um contrato mais longo.`],
['Hipóteses e arrependimentos',`
had I known|se eu soubesse antes|Had I known about the delay, I would have taken another route.|Se eu soubesse do atraso antes, teria seguido outro caminho.
would have|teria feito|We would have finished earlier if the equipment had arrived on time.|Nós teríamos terminado antes se o equipamento tivesse chegado no prazo.
wish|desejar que algo fosse diferente|I wish I had asked more questions before accepting the offer.|Eu gostaria de ter feito mais perguntas antes de aceitar a oferta.
if only|se ao menos|If only we had backed up the files before the computer failed.|Se ao menos tivéssemos feito uma cópia dos arquivos antes de o computador falhar.
otherwise|caso contrário|She helped us find a room; otherwise, we would have missed the event.|Ela nos ajudou a encontrar um quarto; caso contrário, teríamos perdido o evento.
in hindsight|em retrospecto|In hindsight, postponing the launch was the right decision.|Em retrospecto, adiar o lançamento foi a decisão certa.`],
['Projetos e riscos',`
feasible|viável|The plan is feasible as long as we have enough time to test it.|O plano é viável desde que tenhamos tempo suficiente para testá-lo.
contingency plan|plano de contingência|We need a contingency plan in case the venue becomes unavailable.|Nós precisamos de um plano de contingência caso o local fique indisponível.
allocate|alocar / distribuir recursos|We should allocate more time to the tasks that carry the greatest risk.|Nós deveríamos destinar mais tempo às tarefas de maior risco.
setback|contratempo|The funding delay was a setback, but it did not end the project.|O atraso no financiamento foi um contratempo, mas não encerrou o projeto.
milestone|marco de progresso|Completing the first trial will be a significant milestone.|Concluir o primeiro teste será um marco importante.
outcome|resultado|It is difficult to predict the outcome without more information.|É difícil prever o resultado sem mais informações.`],
['Liderança e colaboração',`
delegate|delegar|A manager should delegate tasks without avoiding responsibility.|Um gerente deveria delegar tarefas sem evitar a responsabilidade.
accountable|responsável por prestar contas|Each team remains accountable for the quality of its work.|Cada equipe continua responsável pela qualidade de seu trabalho.
constructive|construtivo|Constructive feedback identifies a problem and suggests a way forward.|Comentários construtivos identificam um problema e sugerem um caminho a seguir.
take initiative|tomar iniciativa|She took initiative by organising a meeting before the conflict grew.|Ela tomou a iniciativa de organizar uma reunião antes de o conflito aumentar.
shared vision|visão compartilhada|A shared vision can help people work towards the same goal.|Uma visão compartilhada pode ajudar as pessoas a trabalhar pelo mesmo objetivo.
resolve|resolver um conflito|We need to resolve the disagreement before it affects the whole team.|Nós precisamos resolver o desentendimento antes que ele afete toda a equipe.`],
['Educação e oportunidades',`
access|acesso|Access to education should not depend entirely on where someone lives.|O acesso à educação não deveria depender inteiramente de onde alguém mora.
lifelong learning|aprendizagem ao longo da vida|Lifelong learning can help people adapt to changes at work.|A aprendizagem ao longo da vida pode ajudar as pessoas a se adaptar a mudanças no trabalho.
tuition fees|mensalidades / taxas de ensino|Higher tuition fees may discourage some students from applying.|Taxas de ensino mais altas podem desestimular alguns estudantes a se candidatar.
assessment|avaliação|The assessment should measure understanding rather than memorisation alone.|A avaliação deveria medir a compreensão, e não apenas a memorização.
equal opportunity|igualdade de oportunidades|Equal opportunity requires more than offering everyone the same information.|A igualdade de oportunidades exige mais do que oferecer a todos as mesmas informações.
practical skills|habilidades práticas|Students need opportunities to apply practical skills in realistic situations.|Os estudantes precisam de oportunidades para aplicar habilidades práticas em situações realistas.`],
['Sustentabilidade e consumo',`
sustainable|sustentável|A sustainable solution must consider both current and future needs.|Uma solução sustentável precisa considerar necessidades atuais e futuras.
carbon footprint|pegada de carbono|The company is trying to reduce its carbon footprint by changing its transport system.|A empresa está tentando reduzir sua pegada de carbono mudando seu sistema de transporte.
renewable|renovável|Renewable energy could play a larger role if storage became more affordable.|A energia renovável poderia ter um papel maior se o armazenamento ficasse mais acessível.
overconsumption|consumo excessivo|Overconsumption creates waste even when individual products are recyclable.|O consumo excessivo gera desperdício mesmo quando os produtos são recicláveis.
long-term impact|impacto de longo prazo|We should consider the long-term impact before choosing the cheapest option.|Nós deveríamos considerar o impacto de longo prazo antes de escolher a opção mais barata.
resource-efficient|eficiente no uso de recursos|A resource-efficient design uses less material without reducing safety.|Um projeto eficiente no uso de recursos utiliza menos material sem reduzir a segurança.`],
['Mídia e credibilidade',`
bias|viés / parcialidade|A source may contain bias even when its facts are accurate.|Uma fonte pode conter viés mesmo quando seus fatos são corretos.
verify|verificar|The claim should be verified before it is repeated publicly.|A afirmação deveria ser verificada antes de ser repetida publicamente.
reliable source|fonte confiável|A reliable source explains where its information comes from.|Uma fonte confiável explica de onde vêm suas informações.
take out of context|tirar de contexto|A short quotation can be misleading when it is taken out of context.|Uma citação curta pode ser enganosa quando é tirada de contexto.
coverage|cobertura jornalística|The coverage focused on the conflict rather than the proposed solutions.|A cobertura se concentrou no conflito, e não nas soluções propostas.
distinguish|distinguir|Readers should distinguish between reported facts and the writer's opinion.|Os leitores deveriam distinguir fatos relatados da opinião do autor.`],
['Tecnologia e sociedade',`
automation|automação|Automation may change the tasks people do rather than remove every job.|A automação pode mudar as tarefas das pessoas em vez de eliminar todos os empregos.
data protection|proteção de dados|Data protection should be considered at the start of a project.|A proteção de dados deveria ser considerada no início de um projeto.
digital divide|desigualdade de acesso digital|The digital divide affects people who lack reliable internet access.|A desigualdade digital afeta pessoas sem acesso confiável à internet.
innovation|inovação|Innovation is valuable when it addresses a real need.|A inovação é valiosa quando atende a uma necessidade real.
drawback|desvantagem / inconveniente|A major drawback of the system is its dependence on a stable connection.|Uma grande desvantagem do sistema é sua dependência de uma conexão estável.
adopt|adotar|Users are more likely to adopt a tool if it is easy to understand.|Os usuários têm mais chance de adotar uma ferramenta se ela for fácil de entender.`],
['Finanças e escolhas',`
financial stability|estabilidade financeira|Financial stability can influence the risks a person is willing to take.|A estabilidade financeira pode influenciar os riscos que uma pessoa está disposta a assumir.
cost-effective|com boa relação entre custo e resultado|The cheapest solution is not always the most cost-effective one.|A solução mais barata nem sempre oferece a melhor relação entre custo e resultado.
hidden cost|custo oculto|Maintenance can become a hidden cost if it is ignored in the budget.|A manutenção pode se tornar um custo oculto se for ignorada no orçamento.
incentive|incentivo|A financial incentive may change behaviour, but its effect can be temporary.|Um incentivo financeiro pode mudar o comportamento, mas seu efeito pode ser temporário.
affordability|acessibilidade financeira|Affordability matters as much as quality when choosing public services.|A acessibilidade financeira importa tanto quanto a qualidade na escolha de serviços públicos.
weigh up|avaliar vantagens e desvantagens|We need to weigh up the costs before committing to the project.|Nós precisamos avaliar os custos antes de nos comprometer com o projeto.`],
['Saúde e comunicação',`
well-being|bem-estar|Workplace well-being involves more than providing comfortable furniture.|O bem-estar no trabalho envolve mais do que oferecer móveis confortáveis.
preventive|preventivo|Preventive measures are often discussed only after a problem appears.|Medidas preventivas muitas vezes só são discutidas depois que surge um problema.
accessibility|acessibilidade|The clinic's accessibility is important for people with limited mobility.|A acessibilidade da clínica é importante para pessoas com mobilidade limitada.
make an informed decision|tomar uma decisão informada|Clear explanations help patients make an informed decision.|Explicações claras ajudam pacientes a tomar uma decisão informada.
raise awareness|conscientizar|The campaign aims to raise awareness without frightening its audience.|A campanha busca conscientizar sem assustar seu público.
confidential|confidencial|Personal information shared during an appointment should remain confidential.|Informações pessoais compartilhadas durante uma consulta deveriam permanecer confidenciais.`],
['Cidades e mobilidade',`
infrastructure|infraestrutura|Better infrastructure could make public transport a more attractive option.|Uma infraestrutura melhor poderia tornar o transporte público uma opção mais atraente.
congestion|congestionamento|Congestion affects both travel time and the quality of life.|O congestionamento afeta tanto o tempo de viagem quanto a qualidade de vida.
pedestrian-friendly|favorável a pedestres|A pedestrian-friendly street needs safe crossings as well as wide pavements.|Uma rua favorável a pedestres precisa de travessias seguras e calçadas largas.
urban planning|planejamento urbano|Urban planning should take local residents' needs into account.|O planejamento urbano deveria levar em conta as necessidades dos moradores locais.
commute|trajeto habitual ao trabalho|A shorter commute would leave me more time for family and study.|Um trajeto mais curto ao trabalho me deixaria mais tempo para família e estudo.
public space|espaço público|A public space is more useful when different groups feel welcome there.|Um espaço público é mais útil quando diferentes grupos se sentem bem-vindos nele.`],
['Cultura e identidade',`
heritage|patrimônio cultural|The festival celebrates local heritage while welcoming new influences.|O festival celebra o patrimônio local e acolhe novas influências.
stereotype|estereótipo|A stereotype can hide the differences between individuals in a group.|Um estereótipo pode esconder as diferenças entre indivíduos de um grupo.
belonging|sentimento de pertencimento|Language can contribute to a sense of belonging.|O idioma pode contribuir para um sentimento de pertencimento.
diversity|diversidade|Diversity can enrich a community when people have opportunities to interact.|A diversidade pode enriquecer uma comunidade quando as pessoas têm oportunidades de interagir.
preserve|preservar|How can traditions be preserved without preventing change?|Como as tradições podem ser preservadas sem impedir mudanças?
perspective|perspectiva|Listening to unfamiliar experiences can broaden our perspective.|Ouvir experiências pouco familiares pode ampliar nossa perspectiva.`],
['Arte e interpretação',`
portray|retratar|The film portrays the conflict from several different perspectives.|O filme retrata o conflito de várias perspectivas diferentes.
subtle|sutil|The actor's subtle performance made the character seem believable.|A atuação sutil do ator fez o personagem parecer convincente.
ambiguous|ambíguo|The ending is ambiguous, so viewers may interpret it differently.|O final é ambíguo, por isso os espectadores podem interpretá-lo de formas diferentes.
symbolise|simbolizar|The empty house may symbolise the character's isolation.|A casa vazia pode simbolizar o isolamento do personagem.
engaging|envolvente|The dialogue is engaging even when very little happens.|O diálogo é envolvente mesmo quando pouco acontece.
critique|análise crítica|A useful critique explains why an artistic choice succeeds or fails.|Uma análise crítica útil explica por que uma escolha artística funciona ou falha.`],
['Pesquisa e evidências',`
findings|resultados de pesquisa|The findings suggest a connection, but they do not prove a cause.|Os resultados sugerem uma relação, mas não provam uma causa.
sample|amostra|A small sample may not represent the whole population.|Uma amostra pequena pode não representar toda a população.
assumption|pressuposto|The argument depends on an assumption that has not been tested.|O argumento depende de um pressuposto que não foi testado.
consistent with|compatível com|The new results are consistent with the earlier observations.|Os novos resultados são compatíveis com as observações anteriores.
limitation|limitação|One limitation is that the participants all came from the same region.|Uma limitação é que todos os participantes vieram da mesma região.
draw a conclusion|tirar uma conclusão|We should avoid drawing a conclusion from a single example.|Nós deveríamos evitar tirar uma conclusão de um único exemplo.`],
['Apresentações e audiência',`
outline|apresentar em linhas gerais|I'll outline the main options before discussing the details.|Eu vou apresentar as principais opções em linhas gerais antes de discutir os detalhes.
highlight|destacar|The presentation should highlight the results most relevant to this audience.|A apresentação deveria destacar os resultados mais relevantes para este público.
take questions|receber perguntas|I'll take questions after explaining how we reached the decision.|Eu vou receber perguntas depois de explicar como chegamos à decisão.
clarify|esclarecer|Let me clarify the difference between the two proposals.|Deixe-me esclarecer a diferença entre as duas propostas.
key takeaway|principal mensagem a levar|The key takeaway is that speed should not come at the expense of accuracy.|A principal mensagem é que a rapidez não deveria prejudicar a precisão.
back up an argument|sustentar um argumento|A clear example can help back up an argument without overwhelming the audience.|Um exemplo claro pode ajudar a sustentar um argumento sem sobrecarregar o público.`],
['Comunicação diplomática',`
I was wondering|eu gostaria de saber|I was wondering whether we could reconsider the deadline.|Eu gostaria de saber se poderíamos reconsiderar o prazo.
with respect|com todo o respeito|With respect, I think we may be overlooking another option.|Com todo o respeito, acho que podemos estar deixando outra opção de lado.
it seems to me|parece-me|It seems to me that we need more information before deciding.|Parece-me que precisamos de mais informações antes de decidir.
not necessarily|não necessariamente|A higher price does not necessarily mean better quality.|Um preço mais alto não significa necessariamente qualidade melhor.
would you mind|você se importaria|Would you mind explaining how the estimate was calculated?|Você se importaria de explicar como a estimativa foi calculada?
raise a concern|levantar uma preocupação|I'd like to raise a concern about the proposed schedule.|Eu gostaria de levantar uma preocupação sobre o cronograma proposto.`],
['Conflitos e mediação',`
misunderstanding|mal-entendido|The conflict began with a misunderstanding about who would make the decision.|O conflito começou com um mal-entendido sobre quem tomaria a decisão.
acknowledge|reconhecer|We should acknowledge the other person's concerns before defending our position.|Nós deveríamos reconhecer as preocupações da outra pessoa antes de defender nossa posição.
common ground|pontos em comum|Finding common ground can make a difficult discussion more productive.|Encontrar pontos em comum pode tornar uma discussão difícil mais produtiva.
fairness|justiça / tratamento justo|Both sides questioned the fairness of the original arrangement.|Os dois lados questionaram se o acordo original era justo.
de-escalate|reduzir a tensão|A calm question may help de-escalate the disagreement.|Uma pergunta calma pode ajudar a reduzir a tensão do desentendimento.
work through|resolver por meio de discussão|We need time to work through the remaining differences.|Nós precisamos de tempo para resolver as diferenças restantes.`],
['Consumo e publicidade',`
persuasive|persuasivo|The advertisement is persuasive because it connects the product with a familiar need.|O anúncio é persuasivo porque relaciona o produto a uma necessidade conhecida.
target audience|público-alvo|The message should be adapted to the target audience.|A mensagem deveria ser adaptada ao público-alvo.
brand loyalty|fidelidade à marca|Brand loyalty may depend on trust as much as on price.|A fidelidade à marca pode depender da confiança tanto quanto do preço.
exaggerate|exagerar|Some advertisements exaggerate what a product can achieve.|Alguns anúncios exageram o que um produto pode fazer.
impulse purchase|compra por impulso|A limited-time offer can encourage an impulse purchase.|Uma oferta por tempo limitado pode incentivar uma compra por impulso.
consumer rights|direitos do consumidor|Clear information helps customers understand their consumer rights.|Informações claras ajudam os clientes a entender seus direitos como consumidores.`],
['Mudanças no trabalho',`
remote work|trabalho remoto|Remote work offers flexibility, but it can make informal communication harder.|O trabalho remoto oferece flexibilidade, mas pode dificultar a comunicação informal.
workload|carga de trabalho|The workload should be reviewed before new responsibilities are added.|A carga de trabalho deveria ser revista antes que novas responsabilidades sejam acrescentadas.
burnout|esgotamento relacionado ao trabalho|A discussion about burnout should include workload and support, not only personal habits.|Uma discussão sobre esgotamento deveria incluir carga de trabalho e apoio, não apenas hábitos pessoais.
productivity|produtividade|Productivity is not always reflected in the number of hours spent online.|A produtividade nem sempre se reflete no número de horas passadas online.
upskill|desenvolver novas habilidades profissionais|The training programme gives staff time to upskill.|O programa de treinamento dá aos funcionários tempo para desenvolver novas habilidades.
job satisfaction|satisfação no trabalho|Job satisfaction can improve when people have a clear sense of purpose.|A satisfação no trabalho pode melhorar quando as pessoas têm um propósito claro.`],
['Regras e decisões coletivas',`
policy|política / diretriz institucional|A policy should be reviewed when its effects differ from its original aims.|Uma diretriz deveria ser revista quando seus efeitos diferem dos objetivos originais.
stakeholder|parte interessada|Each stakeholder may be affected by the decision in a different way.|Cada parte interessada pode ser afetada pela decisão de uma maneira diferente.
transparency|transparência|Transparency helps people understand how a decision was made.|A transparência ajuda as pessoas a entender como uma decisão foi tomada.
enforce|fazer cumprir|It is difficult to enforce a rule that people do not understand.|É difícil fazer cumprir uma regra que as pessoas não entendem.
consultation|consulta às partes envolvidas|The consultation gave residents a chance to suggest alternatives.|A consulta deu aos moradores a oportunidade de sugerir alternativas.
unintended consequence|consequência não intencional|An unintended consequence may appear even when a policy has a reasonable aim.|Uma consequência não intencional pode surgir mesmo quando uma diretriz tem um objetivo razoável.`],
['Turismo e impactos',`
overtourism|excesso de turismo|Overtourism can put pressure on housing and local services.|O excesso de turismo pode pressionar a moradia e os serviços locais.
local economy|economia local|Tourism supports the local economy, although its benefits may be uneven.|O turismo apoia a economia local, embora seus benefícios possam ser desiguais.
responsible tourism|turismo responsável|Responsible tourism involves respecting residents as well as natural areas.|O turismo responsável envolve respeitar moradores e áreas naturais.
cultural exchange|intercâmbio cultural|A cultural exchange is more meaningful when both sides have a voice.|Um intercâmbio cultural é mais significativo quando os dois lados têm voz.
seasonal|sazonal|Seasonal employment can make long-term planning difficult.|O emprego sazonal pode dificultar o planejamento de longo prazo.
carry out|realizar|The council will carry out a study before expanding the visitor centre.|A administração local vai realizar um estudo antes de ampliar o centro de visitantes.`],
['Ambição e decisões pessoais',`
fulfilling|gratificante|A fulfilling career may offer something that a higher salary cannot.|Uma carreira gratificante pode oferecer algo que um salário maior não oferece.
take a calculated risk|assumir um risco calculado|She took a calculated risk after comparing several possible outcomes.|Ela assumiu um risco calculado depois de comparar vários resultados possíveis.
prioritise|priorizar|I've learned to prioritise tasks instead of treating everything as urgent.|Eu aprendi a priorizar tarefas em vez de tratar tudo como urgente.
resilience|capacidade de se recuperar|Resilience does not mean ignoring difficulties or refusing help.|A capacidade de se recuperar não significa ignorar dificuldades nem recusar ajuda.
realistic expectation|expectativa realista|A realistic expectation can help us recognise progress without giving up too soon.|Uma expectativa realista pode nos ajudar a reconhecer o progresso sem desistir cedo demais.
follow through|levar até o fim|The hardest part was following through after the initial excitement faded.|A parte mais difícil foi levar o plano até o fim depois que o entusiasmo inicial diminuiu.`],
['Estilo e registro',`
formal|formal|A formal request may be appropriate when writing to an unfamiliar organisation.|Um pedido formal pode ser adequado ao escrever para uma organização desconhecida.
informal|informal|An informal tone can make a message friendly, but context still matters.|Um tom informal pode tornar uma mensagem amigável, mas o contexto continua importante.
concise|conciso|A concise summary includes the main points without unnecessary detail.|Um resumo conciso inclui os pontos principais sem detalhes desnecessários.
tone|tom da comunicação|The same sentence can sound different depending on its tone.|A mesma frase pode soar diferente dependendo do tom.
paraphrase|parafrasear|Could you paraphrase the explanation for someone without technical knowledge?|Você poderia parafrasear a explicação para alguém sem conhecimento técnico?
appropriate|adequado|The most appropriate wording depends on the relationship between the speakers.|A formulação mais adequada depende da relação entre os interlocutores.`],
['Síntese e posicionamento',`
overall|de modo geral|Overall, the proposal is promising, but several questions remain unanswered.|De modo geral, a proposta é promissora, mas várias perguntas continuam sem resposta.
take into account|levar em conta|We should take into account both the cost and the effect on users.|Nós deveríamos levar em conta o custo e o efeito sobre os usuários.
in contrast|em contraste|The first option is faster; in contrast, the second offers more flexibility.|A primeira opção é mais rápida; em contraste, a segunda oferece mais flexibilidade.
draw attention to|chamar atenção para|I'd like to draw attention to a risk that has not yet been discussed.|Eu gostaria de chamar atenção para um risco que ainda não foi discutido.
come to a decision|chegar a uma decisão|We came to a decision after comparing the evidence from both trials.|Nós chegamos a uma decisão depois de comparar as evidências dos dois testes.
provided that|desde que|I would support the proposal provided that its results are reviewed regularly.|Eu apoiaria a proposta desde que seus resultados fossem revistos regularmente.`]
];
const topics=blocks.map(([topic,text])=>[topic,text.trim().split('\n').map(row=>row.split('|'))]);
root.StudyB2=topics;if(typeof module!=='undefined')module.exports=topics;
})(globalThis);
