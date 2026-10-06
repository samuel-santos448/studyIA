'use strict';
(function(root){
const blocks=[
['Cautela e graus de certeza',`
arguably|pode-se argumentar que|The redesign is arguably more accessible, although user testing remains limited.|Pode-se argumentar que o novo projeto é mais acessível, embora os testes com usuários ainda sejam limitados.
tentative|provisório / não definitivo|These are tentative conclusions rather than a definitive explanation.|Estas são conclusões provisórias, e não uma explicação definitiva.
plausible|plausível|The account is plausible, but plausibility alone does not establish its accuracy.|O relato é plausível, mas a plausibilidade por si só não comprova sua precisão.
to the best of my knowledge|até onde vai meu conhecimento|To the best of my knowledge, no alternative has been formally evaluated.|Até onde vai meu conhecimento, nenhuma alternativa foi formalmente avaliada.
cannot rule out|não poder descartar|We cannot rule out the possibility that several factors contributed to the delay.|Nós não podemos descartar a possibilidade de que vários fatores tenham contribuído para o atraso.
subject to revision|sujeito a revisão|The estimate is subject to revision as more information becomes available.|A estimativa está sujeita a revisão conforme surgirem mais informações.`],
['Precisão conceitual',`
distinction|distinção|The distinction between intention and impact is central to this discussion.|A distinção entre intenção e impacto é central nesta discussão.
scope|escopo / alcance|We should define the scope of the claim before debating its implications.|Nós deveríamos definir o alcance da afirmação antes de discutir suas implicações.
criterion|critério|Cost is one criterion, but it should not be the sole basis for comparison.|O custo é um critério, mas não deveria ser a única base de comparação.
underlying|subjacente|The underlying assumption is that users have equal access to support.|O pressuposto subjacente é que os usuários têm o mesmo acesso a apoio.
qualify a statement|fazer uma ressalva a uma afirmação|I should qualify that statement: the improvement applies only to the tested group.|Eu deveria fazer uma ressalva a essa afirmação: a melhoria se aplica apenas ao grupo testado.
ambiguity|ambiguidade|The ambiguity lies in whether the promise concerns speed or reliability.|A ambiguidade está em saber se a promessa se refere à rapidez ou à confiabilidade.`],
['Concessão e argumentação',`
admittedly|reconhecidamente / é verdade que|Admittedly, the sample is small, but the pattern deserves further investigation.|É verdade que a amostra é pequena, mas o padrão merece investigação adicional.
notwithstanding|apesar de|Notwithstanding these objections, the proposal warrants careful consideration.|Apesar dessas objeções, a proposta merece consideração cuidadosa.
be that as it may|seja como for|Be that as it may, we still need an explanation for the missing data.|Seja como for, ainda precisamos de uma explicação para os dados ausentes.
granted|admitindo-se que|Granted, the change is inconvenient; the question is whether the benefit justifies it.|Admitindo-se que a mudança seja inconveniente, a questão é se o benefício a justifica.
compelling|convincente / persuasivo|The argument is compelling precisely because it acknowledges its own limitations.|O argumento é convincente justamente porque reconhece suas próprias limitações.
fall short of|ficar aquém de|The evidence falls short of demonstrating that the change caused the improvement.|As evidências ficam aquém de demonstrar que a mudança causou a melhoria.`],
['Síntese de perspectivas',`
reconcile|conciliar|We need to reconcile the demand for consistency with the need for local flexibility.|Nós precisamos conciliar a exigência de consistência com a necessidade de flexibilidade local.
converge|convergir|The accounts converge on the main sequence of events but differ on the motives.|Os relatos convergem quanto à sequência principal dos acontecimentos, mas diferem quanto aos motivos.
diverge|divergir|Their recommendations diverge because they assign different weight to the same risks.|As recomendações deles divergem porque atribuem pesos diferentes aos mesmos riscos.
common denominator|denominador comum|The common denominator across the interviews was a lack of clear communication.|O denominador comum das entrevistas foi a falta de comunicação clara.
integrate|integrar|A useful summary integrates the findings without erasing the disagreements.|Um resumo útil integra os resultados sem apagar as divergências.
coherent account|relato coerente|Can we build a coherent account that accommodates both sets of observations?|Podemos construir um relato coerente que contemple os dois conjuntos de observações?`],
['Estrutura e coesão',`
insofar as|na medida em que|The comparison is useful insofar as the two groups faced similar conditions.|A comparação é útil na medida em que os dois grupos enfrentaram condições semelhantes.
thereby|desse modo|The revision removes an unnecessary step, thereby reducing the chance of confusion.|A revisão elimina uma etapa desnecessária, reduzindo desse modo a chance de confusão.
in turn|por sua vez|Clearer instructions improve participation, which in turn makes feedback more representative.|Instruções mais claras melhoram a participação, o que por sua vez torna os comentários mais representativos.
by contrast|em contrapartida|The first account emphasises individual choice; the second, by contrast, focuses on constraints.|O primeiro relato enfatiza a escolha individual; o segundo, em contrapartida, se concentra nas restrições.
with regard to|no que diz respeito a|With regard to implementation, the report leaves several practical questions open.|No que diz respeito à implementação, o relatório deixa várias questões práticas em aberto.
to put it another way|para dizer de outra forma|To put it another way, the problem concerns access rather than a lack of interest.|Para dizer de outra forma, o problema diz respeito ao acesso, e não à falta de interesse.`],
['Pesquisa e interpretação',`
corroborate|corroborar / confirmar com evidência adicional|Independent records corroborate the sequence described in the interviews.|Registros independentes corroboram a sequência descrita nas entrevistas.
causal link|relação causal|A causal link cannot be established merely by observing that two trends coincide.|Uma relação causal não pode ser estabelecida apenas ao observar que duas tendências coincidem.
representative|representativo|A representative sample should reflect the population relevant to the question.|Uma amostra representativa deveria refletir a população pertinente à questão.
robust|sólido / resistente a variações|We need to know whether the result remains robust under different assumptions.|Nós precisamos saber se o resultado permanece sólido sob pressupostos diferentes.
inference|inferência|The inference is reasonable, provided we make its assumptions explicit.|A inferência é razoável, desde que explicitemos seus pressupostos.
replicate|replicar|The method should be described clearly enough for another team to replicate it.|O método deveria ser descrito com clareza suficiente para outra equipe replicá-lo.`],
['Ética e responsabilidade',`
ethical dilemma|dilema ético|The ethical dilemma arises when two legitimate responsibilities point in different directions.|O dilema ético surge quando duas responsabilidades legítimas apontam em direções diferentes.
proportional|proporcional|Any restriction should be proportional to the problem it is intended to address.|Qualquer restrição deveria ser proporcional ao problema que pretende enfrentar.
accountability|responsabilização / prestação de contas|Accountability requires both clear responsibilities and a way to review decisions.|A prestação de contas exige responsabilidades claras e uma forma de rever decisões.
informed consent|consentimento informado|An explanation should be understandable if it is to support informed consent.|Uma explicação precisa ser compreensível para favorecer o consentimento informado.
conflict of interest|conflito de interesses|A declared conflict of interest does not automatically invalidate an argument.|Um conflito de interesses declarado não invalida automaticamente um argumento.
justify|justificar|Can we justify the decision to people who bear its costs but gain little from it?|Podemos justificar a decisão às pessoas que arcam com seus custos, mas se beneficiam pouco dela?`],
['Diplomacia e objeções',`
reservation|ressalva / receio|My main reservation concerns how the proposal would affect smaller organisations.|Minha principal ressalva diz respeito a como a proposta afetaria organizações menores.
with due respect|com o devido respeito|With due respect, that conclusion seems to go beyond the evidence presented.|Com o devido respeito, essa conclusão parece ir além das evidências apresentadas.
take issue with|discordar de um ponto|I take issue with the assumption that all participants had the same options.|Eu discordo do pressuposto de que todos os participantes tinham as mesmas opções.
be inclined to|tender a|I would be inclined to support a trial rather than immediate full implementation.|Eu tenderia a apoiar um teste em vez de uma implementação completa imediata.
allay concerns|reduzir preocupações|A transparent review process may help allay concerns about fairness.|Um processo transparente de revisão pode ajudar a reduzir preocupações com a justiça.
constructive disagreement|discordância construtiva|Constructive disagreement should challenge the reasoning without dismissing the person.|Uma discordância construtiva deveria questionar o raciocínio sem desqualificar a pessoa.`],
['Negociação estratégica',`
leverage|poder de negociação|Our leverage is limited, so maintaining a reliable relationship matters.|Nosso poder de negociação é limitado, por isso manter uma relação confiável importa.
non-negotiable|inegociável|Safety is non-negotiable, even if other conditions remain open to discussion.|A segurança é inegociável, mesmo que outras condições continuem abertas à discussão.
room for manoeuvre|margem de manobra|The fixed deadline leaves little room for manoeuvre on the schedule.|O prazo fixo deixa pouca margem de manobra no cronograma.
impasse|impasse|The discussion reached an impasse when neither side would revise its minimum terms.|A discussão chegou a um impasse quando nenhum lado quis rever suas condições mínimas.
reciprocal|recíproco|A reciprocal commitment would distribute the risk more evenly.|Um compromisso recíproco distribuiria o risco de forma mais equilibrada.
broker an agreement|intermediar um acordo|The mediator helped broker an agreement without deciding the terms for either side.|O mediador ajudou a intermediar um acordo sem decidir as condições por nenhum dos lados.`],
['Liderança e mudança',`
buy-in|adesão / apoio comprometido|The change is unlikely to succeed without genuine staff buy-in.|A mudança dificilmente terá sucesso sem uma adesão real dos funcionários.
resistance|resistência|Resistance may reflect practical concerns rather than opposition to the goal itself.|A resistência pode refletir preocupações práticas, e não oposição ao próprio objetivo.
align|alinhar|The team needs to align its daily priorities with the organisation's stated aims.|A equipe precisa alinhar suas prioridades diárias aos objetivos declarados da organização.
empower|dar autonomia / capacitar|The policy should empower local teams to respond to unfamiliar situations.|A diretriz deveria dar autonomia às equipes locais para responder a situações pouco familiares.
foster trust|promover confiança|Consistent follow-up can foster trust more effectively than broad promises.|Um acompanhamento consistente pode promover confiança de forma mais eficaz do que promessas amplas.
institutional memory|memória institucional|Losing experienced staff can weaken institutional memory even when procedures are documented.|Perder funcionários experientes pode enfraquecer a memória institucional mesmo quando os procedimentos estão documentados.`],
['Economia e distribuição',`
disparity|disparidade|The disparity between regions makes a single national average difficult to interpret.|A disparidade entre regiões torna difícil interpretar uma única média nacional.
disproportionate|desproporcional|A flat fee may place a disproportionate burden on lower-income households.|Uma taxa fixa pode impor um peso desproporcional a famílias de renda menor.
redistribute|redistribuir|The proposal would redistribute costs rather than remove them entirely.|A proposta redistribuiria os custos em vez de eliminá-los por completo.
externality|efeito sobre terceiros não refletido diretamente na transação|Noise from an activity can be an externality borne by nearby residents.|O ruído de uma atividade pode ser um efeito externo suportado por moradores próximos.
incentive structure|estrutura de incentivos|The incentive structure may reward speed even when accuracy is the stated priority.|A estrutura de incentivos pode recompensar a rapidez mesmo quando a precisão é a prioridade declarada.
economic viability|viabilidade econômica|Economic viability must be considered alongside the proposed social benefits.|A viabilidade econômica precisa ser considerada junto com os benefícios sociais propostos.`],
['Tecnologia e governança',`
oversight|supervisão|Effective oversight requires access to information as well as the authority to act.|Uma supervisão eficaz exige acesso a informações e autoridade para agir.
traceability|rastreabilidade|Traceability makes it possible to reconstruct how a particular decision was reached.|A rastreabilidade torna possível reconstruir como determinada decisão foi tomada.
interoperability|interoperabilidade|Interoperability matters when users need to move information between different systems.|A interoperabilidade importa quando os usuários precisam transferir informações entre sistemas diferentes.
unintended use|uso não previsto|The design should consider foreseeable unintended use, not only the ideal scenario.|O projeto deveria considerar usos não previstos que sejam previsíveis, e não apenas o cenário ideal.
safeguard|mecanismo de proteção|A safeguard is useful only if it works under the conditions in which it is needed.|Um mecanismo de proteção só é útil se funcionar nas condições em que é necessário.
governance|governança|Good governance clarifies who can make decisions and how those decisions are reviewed.|Uma boa governança esclarece quem pode tomar decisões e como elas são revistas.`],
['Ambiente e políticas',`
mitigate|reduzir a gravidade de um impacto|The measures are intended to mitigate the impact rather than eliminate it entirely.|As medidas buscam reduzir o impacto, e não eliminá-lo por completo.
adaptation|adaptação|Adaptation requires attention to local conditions rather than a uniform response.|A adaptação exige atenção às condições locais, e não uma resposta uniforme.
irreversible|irreversível|An irreversible change calls for particular care when the evidence is uncertain.|Uma mudança irreversível exige cuidado especial quando as evidências são incertas.
precautionary|de precaução|A precautionary approach may be justified when the potential damage is substantial.|Uma abordagem de precaução pode ser justificada quando o dano potencial é significativo.
cumulative|cumulativo|The cumulative effect of small changes may be greater than any single change suggests.|O efeito cumulativo de pequenas mudanças pode ser maior do que qualquer mudança isolada sugere.
ecological balance|equilíbrio ecológico|The discussion should address ecological balance as well as immediate economic gains.|A discussão deveria abordar o equilíbrio ecológico e os ganhos econômicos imediatos.`],
['Cidade e pertencimento',`
displacement|deslocamento forçado / saída involuntária|Residents feared displacement as the area became more expensive.|Os moradores temiam ter de deixar a região à medida que ela ficava mais cara.
inclusive|inclusivo|An inclusive public space must accommodate different ways of using it.|Um espaço público inclusivo precisa contemplar diferentes formas de utilizá-lo.
social cohesion|coesão social|Social cohesion is difficult to maintain when groups rarely have opportunities to meet.|É difícil manter a coesão social quando os grupos raramente têm oportunidades de se encontrar.
livability|condições que tornam um lugar bom para viver|Livability depends on everyday access to services as much as on attractive buildings.|As condições de vida dependem do acesso cotidiano a serviços tanto quanto de prédios atraentes.
spatial inequality|desigualdade espacial|Spatial inequality can make the same public service much harder to reach for some residents.|A desigualdade espacial pode tornar o mesmo serviço público muito mais difícil de acessar para alguns moradores.
sense of place|vínculo e identidade associados a um lugar|Redevelopment can preserve buildings while weakening a community's sense of place.|A reurbanização pode preservar prédios e ao mesmo tempo enfraquecer o vínculo de uma comunidade com o lugar.`],
['Cultura e representação',`
nuanced|com nuances|A nuanced portrayal allows characters to be inconsistent without reducing them to stereotypes.|Uma representação com nuances permite que os personagens sejam contraditórios sem reduzi-los a estereótipos.
appropriation|apropriação|The debate about appropriation concerns power and context, not merely the movement of ideas.|O debate sobre apropriação diz respeito a poder e contexto, e não apenas à circulação de ideias.
authenticity|autenticidade|Claims of authenticity may conceal disagreement about whose experience counts.|Afirmações de autenticidade podem ocultar divergências sobre quais experiências são consideradas válidas.
hybrid|híbrido|The work uses a hybrid style that draws on several different traditions.|A obra usa um estilo híbrido que recorre a várias tradições diferentes.
marginalise|marginalizar|A dominant narrative can marginalise experiences that do not fit its central theme.|Uma narrativa dominante pode marginalizar experiências que não se encaixam em seu tema central.
representation|representação|Representation involves both who appears in a story and how they are portrayed.|A representação envolve quem aparece em uma história e como essas pessoas são retratadas.`],
['Literatura e subtexto',`
subtext|subtexto|The subtext suggests resentment even though the dialogue remains polite.|O subtexto sugere ressentimento embora o diálogo permaneça educado.
unreliable narrator|narrador não confiável|An unreliable narrator may reveal more through omissions than through direct statements.|Um narrador não confiável pode revelar mais pelas omissões do que pelas afirmações diretas.
juxtaposition|justaposição|The juxtaposition of the two scenes invites the reader to question the apparent contrast.|A justaposição das duas cenas convida o leitor a questionar o contraste aparente.
foreshadow|antecipar narrativamente|The opening conversation foreshadows a conflict that becomes explicit much later.|A conversa inicial antecipa um conflito que se torna explícito muito depois.
motif|motivo recorrente|The recurring motif connects events that initially seem unrelated.|O motivo recorrente conecta acontecimentos que inicialmente parecem não ter relação.
irony|ironia|The irony depends on the gap between what the character believes and what the reader knows.|A ironia depende da diferença entre o que o personagem acredita e o que o leitor sabe.`],
['Comunicação acadêmica',`
substantiate|fundamentar com evidências|The author needs to substantiate the central claim rather than repeat it.|O autor precisa fundamentar a afirmação central com evidências, e não repeti-la.
premise|premissa|If the premise is questionable, the conclusion requires further justification.|Se a premissa é questionável, a conclusão exige justificativa adicional.
conceptual framework|estrutura conceitual|The conceptual framework determines which relationships the study is designed to examine.|A estrutura conceitual determina quais relações o estudo pretende examinar.
methodological|metodológico|The disagreement is partly methodological rather than a dispute about the observations.|A divergência é em parte metodológica, e não uma disputa sobre as observações.
generalise|generalizar|It would be premature to generalise from this case to all organisations.|Seria prematuro generalizar este caso para todas as organizações.
scholarly debate|debate acadêmico|A scholarly debate can remain unresolved while still improving the questions being asked.|Um debate acadêmico pode continuar sem solução e ainda assim melhorar as perguntas formuladas.`],
['Entrevistas e escuta',`
probe|investigar com perguntas adicionais|A follow-up question can probe the reasoning without sounding accusatory.|Uma pergunta de acompanhamento pode investigar o raciocínio sem soar acusatória.
elicit|obter por meio de uma pergunta|The question was designed to elicit an example rather than a general opinion.|A pergunta foi elaborada para obter um exemplo, e não uma opinião geral.
leading question|pergunta que induz uma resposta|A leading question may influence the account before the speaker has explained it.|Uma pergunta indutiva pode influenciar o relato antes de o interlocutor explicá-lo.
paraphrase accurately|parafrasear com precisão|Before disagreeing, I want to paraphrase accurately what you have said.|Antes de discordar, eu quero parafrasear com precisão o que você disse.
implicit|implícito|An implicit expectation may need to be made explicit before the disagreement can be resolved.|Uma expectativa implícita pode precisar ser explicitada antes que a divergência seja resolvida.
rapport|sintonia e confiança entre interlocutores|Building rapport does not require agreeing with every answer.|Criar sintonia não exige concordar com todas as respostas.`],
['Registro e estilo profissional',`
understated|discreto / sem ênfase excessiva|An understated response may communicate concern more effectively than dramatic language.|Uma resposta discreta pode comunicar preocupação de forma mais eficaz do que uma linguagem dramática.
assertive|assertivo|An assertive message states a boundary without making an unnecessary accusation.|Uma mensagem assertiva estabelece um limite sem fazer uma acusação desnecessária.
circumlocution|circunlóquio / expressão indireta longa|Excessive circumlocution can make a simple request difficult to understand.|Um excesso de circunlóquios pode tornar difícil entender um pedido simples.
colloquial|coloquial|A colloquial expression may be suitable in conversation but distracting in a formal report.|Uma expressão coloquial pode ser adequada em uma conversa, mas distrair em um relatório formal.
register shift|mudança de registro|The register shift signals that the speaker is moving from a formal explanation to a personal aside.|A mudança de registro indica que o interlocutor passa de uma explicação formal a um comentário pessoal.
wording|formulação textual|The wording should preserve the concern without implying that the outcome is already known.|A formulação deveria preservar a preocupação sem sugerir que o resultado já é conhecido.`],
['Decisões sob incerteza',`
contingent on|dependente de|The recommendation is contingent on the availability of reliable support.|A recomendação depende da disponibilidade de apoio confiável.
weigh competing priorities|ponderar prioridades concorrentes|We must weigh competing priorities rather than assume they can all be met simultaneously.|Nós precisamos ponderar prioridades concorrentes em vez de supor que todas podem ser atendidas ao mesmo tempo.
reversible|reversível|A reversible trial may be preferable when the consequences remain uncertain.|Um teste reversível pode ser preferível quando as consequências continuam incertas.
margin of error|margem de erro|The difference is small enough that the margin of error matters.|A diferença é pequena o suficiente para que a margem de erro importe.
reasoned judgement|julgamento fundamentado|A reasoned judgement can acknowledge uncertainty without refusing to make a decision.|Um julgamento fundamentado pode reconhecer a incerteza sem se recusar a tomar uma decisão.
foreseeable|previsível|A foreseeable risk should not be dismissed merely because it has not yet occurred.|Um risco previsível não deveria ser descartado apenas porque ainda não ocorreu.`],
['Memória e narrativa pública',`
collective memory|memória coletiva|Collective memory can preserve an event while changing the emphasis placed on it.|A memória coletiva pode preservar um acontecimento enquanto muda a ênfase dada a ele.
contested|disputado / objeto de controvérsia|The account remains contested because the surviving sources offer different perspectives.|O relato continua controverso porque as fontes preservadas oferecem perspectivas diferentes.
retrospective|retrospectivo|A retrospective explanation may make a decision seem more inevitable than it felt at the time.|Uma explicação retrospectiva pode fazer uma decisão parecer mais inevitável do que parecia na época.
commemorate|comemorar / marcar a memória de|The exhibition seeks to commemorate the event without presenting a single definitive interpretation.|A exposição busca marcar a memória do acontecimento sem apresentar uma única interpretação definitiva.
omission|omissão|An omission can shape a narrative as strongly as an explicit statement.|Uma omissão pode moldar uma narrativa tanto quanto uma afirmação explícita.
historical context|contexto histórico|The quotation needs to be understood within its historical context.|A citação precisa ser entendida em seu contexto histórico.`],
['Avaliação de propostas',`
warrant|justificar / merecer|The potential benefit warrants a closer examination of the proposal.|O benefício potencial justifica um exame mais atento da proposta.
viable alternative|alternativa viável|A viable alternative must address the practical constraints, not only the desired result.|Uma alternativa viável precisa considerar as restrições práticas, e não apenas o resultado desejado.
underestimate|subestimar|The plan may underestimate the time needed to train new users.|O plano pode subestimar o tempo necessário para treinar novos usuários.
overstate|exagerar uma afirmação|The summary overstates the certainty of the original findings.|O resumo exagera o grau de certeza dos resultados originais.
merit|mérito / valor de uma proposta|The idea has merit even if its current implementation is flawed.|A ideia tem mérito mesmo que sua implementação atual tenha falhas.
benchmark|referência para comparação|A meaningful benchmark should reflect the conditions in which the service will operate.|Uma referência significativa de comparação deveria refletir as condições em que o serviço funcionará.`],
['Desacordo e identidade',`
entrenched|arraigado / firmemente estabelecido|Entrenched positions can make participants interpret every question as a challenge.|Posições arraigadas podem fazer os participantes interpretar toda pergunta como um questionamento hostil.
polarise|polarizar|A simplified account may polarise a discussion that originally contained several distinct concerns.|Um relato simplificado pode polarizar uma discussão que inicialmente continha várias preocupações distintas.
empathy|empatia|Empathy can help explain another person's reaction without endorsing every conclusion.|A empatia pode ajudar a explicar a reação de outra pessoa sem endossar todas as conclusões.
legitimate concern|preocupação legítima|Acknowledging a legitimate concern does not require accepting the proposed solution.|Reconhecer uma preocupação legítima não exige aceitar a solução proposta.
reframe|reformular a perspectiva de|We could reframe the question around shared needs rather than competing identities.|Nós poderíamos reformular a questão em torno de necessidades compartilhadas, e não de identidades concorrentes.
bridge a divide|aproximar lados separados por uma divergência|A shared practical task may help bridge a divide that abstract debate has reinforced.|Uma tarefa prática compartilhada pode ajudar a aproximar lados que um debate abstrato afastou.`],
['Conclusões e recomendações',`
on the grounds that|com base no argumento de que|The proposal was rejected on the grounds that its costs had not been adequately assessed.|A proposta foi rejeitada com base no argumento de que seus custos não tinham sido avaliados adequadamente.
in light of|à luz de|In light of the new evidence, the recommendation should be reconsidered.|À luz das novas evidências, a recomendação deveria ser reconsiderada.
all things considered|considerando todos os fatores|All things considered, a limited trial appears more defensible than immediate expansion.|Considerando todos os fatores, um teste limitado parece mais defensável do que uma expansão imediata.
qualified support|apoio com ressalvas|I would offer qualified support, conditional on a clear review process.|Eu ofereceria apoio com ressalvas, condicionado a um processo claro de revisão.
subsequent|posterior / subsequente|Subsequent decisions should take account of what the trial actually demonstrates.|As decisões posteriores deveriam levar em conta o que o teste realmente demonstra.
provisional recommendation|recomendação provisória|This is a provisional recommendation, not a claim that the matter has been settled.|Esta é uma recomendação provisória, e não uma afirmação de que a questão foi resolvida.`],
['Tradução e mediação linguística',`
retain nuance|preservar nuances|A good translation should retain nuance without reproducing every structure literally.|Uma boa tradução deveria preservar nuances sem reproduzir literalmente todas as estruturas.
idiomatic|idiomático / natural no idioma|The translation is accurate in meaning but does not sound idiomatic.|A tradução é precisa no significado, mas não soa natural no idioma.
connotation|conotação|The two words have similar definitions but carry different connotations.|As duas palavras têm definições semelhantes, mas carregam conotações diferentes.
loss of meaning|perda de significado|Simplifying the explanation need not entail a substantial loss of meaning.|Simplificar a explicação não precisa implicar uma perda significativa de significado.
mediate|mediar|An interpreter may need to mediate a misunderstanding as well as translate the words.|Um intérprete pode precisar mediar um mal-entendido além de traduzir as palavras.
render|traduzir / expressar em outra forma|The phrase is difficult to render naturally without knowing the speaker's intention.|É difícil traduzir a frase de forma natural sem conhecer a intenção do interlocutor.`]
];
const topics=blocks.map(([topic,text])=>[topic,text.trim().split('\n').map(row=>row.split('|'))]);
root.StudyC1=topics;if(typeof module!=='undefined')module.exports=topics;
})(globalThis);
