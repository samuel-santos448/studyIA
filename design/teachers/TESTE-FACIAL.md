# Avatares faciais do Zezinho e da Mariazinha

A prévia usa o modelo enviado pelo usuário e uma preparação facial experimental feita no Blender. O original em Downloads e o arquivo Mariazinha-facial.blend não foram sobrescritos.

## Testar

Na aplicação em execução, abra `/teacher-preview.html` e clique em **Ouvir fala de teste**. Também é possível escolher um arquivo de áudio local. A página não usa o microfone e não envia o arquivo ao servidor ou à OpenAI.

Para avaliar na conversa ao vivo da aplicação completa, abra `/#conversation` e selecione Zezinho ou Mariazinha. A conversa mantém seus requisitos normais de conta, HTTPS, permissão do microfone e configuração do provedor de voz. O teste local isolado não configura esse serviço.

Somente os dois novos modelos aparecem na conversação. O SVG antigo e o personagem procedural foram removidos do fluxo ativo. Durante o carregamento há uma mensagem; falhas de carregamento ou perda de contexto WebGL exibem uma mensagem sem restaurar o antigo personagem.

## Conteúdo

- `assets/teachers/zezinho-facial.glb`: modelo enviado em Zezinho.blend com abertura arqueada, lábio superior independente, bochechas e pálpebras. Original preservado; fonte editada em C:/Users/Administrador/Documents/Zezinho-facial-refinado.blend.
- `assets/teachers/mariazinha-preview.glb`: esqueleto, animações corporais, piscadas independentes, abertura da boca, arredondamento e alargamento moderados dos lábios, interior e dentes superiores.
- `assets/teachers/speech-test.wav`: frase de teste sintetizada localmente com a voz Microsoft Zira; não é a voz de produção da professora.
- `teacher-imported.mjs`: carregamento, animação corporal e aplicação dos controles ao GLB.
- `teacher-imported-speech.mjs`: mistura e suavização dos controles de fala.

HeadAudio analisa o áudio no navegador e infere posições dos lábios. A abertura também tem o fallback por energia já existente no StudyIA. Isso é uma aproximação visual; não constitui avaliação de pronúncia nem alinhamento fonético exato. Pausar, terminar o áudio ou desconectar a sessão restaura os controles de boca.

A aparência das pálpebras fechadas e os contornos dos lábios ainda precisam de refinamento artístico. A versão não cumpre o contrato completo de entrega facial de produção, que exige mais expressões e visemas individuais. Não foi implantada no servidor CentOS.

## Verificação

Os testes verificam os morph targets exportados, pesos do esqueleto, movimentos e retorno ao repouso. A verificação no Edge reproduziu uma frase em inglês e confirmou eventos do analisador de visemas, movimentação da mandíbula e restauração das duas malhas de boca ao final, sem erros de JavaScript.

## Acabamento da boca · revisão 5

A revisão adiciona subdivisão local ao redor dos lábios, preserva as normais e a orientação originais da malha e reconstrói as poses a partir da forma neutra. Isso evita que arredondar ou alargar a boca herde a abertura da mandíbula.

A abertura usa uma curva suave, com os cantos progressivamente fixos e transição entre lábio inferior e queixo. O interior é uma superfície côncava, com dentes superiores individuais de bordas arredondadas, gengiva e língua que acompanha a abertura. Os controles da cavidade e da língua seguem os controles dos lábios no navegador.

A verificação visual cobre repouso e aberturas de 35%, 70% e 100%. O teste de exportação também rejeita poses de arredondamento/alargamento que contenham abertura vertical indevida.

Arquivo de trabalho local: `C:\Users\Administrador\Documents\Mariazinha-facial-acabamento-v5.blend`. A prévia permanece experimental; não foi implantada no CentOS.

## Correção visual · revisão 6

A revisão restaura explicitamente a geometria da chave Basis antes de reconstruir as poses. A suavização dos novos vértices é transferida das faces originais por interpolação baricêntrica, preservando o contorno dos lábios em repouso. A comparação no navegador usa o modelo original e o exportado sob a mesma iluminação e animação.

A abertura geométrica da mandíbula foi ampliada de 6,8 mm para 10,5 mm na escala original do modelo. O controlador amplifica a abertura inferida da fala em 1,9, com limite de 0,85, e reduz a intensidade de arredondamento/alargamento para evitar expressões excessivas. O teste no Edge confirmou abertura maior e restauração de todas as malhas da boca ao terminar.

Arquivo local: `C:\Users\Administrador\Documents\Mariazinha-facial-corrigida-v6.blend`. Atualize a página de prévia com Ctrl+F5 para carregar o novo GLB e controlador.

## Transições de fala · revisão 8

O controlador preserva transições entre sílabas: a detecção mantém atividade por 150 ms depois da última amostra audível; entrar em escuta libera os pesos sem zerar imediatamente a mandíbula. A abertura e o fechamento têm tempos diferentes, e consoantes com lábios fechados continuam recebendo fechamento mais rápido. Arredondamento e alargamento deixam de ser aplicados integralmente ao mesmo tempo.

Pausar ou encerrar a reprodução continua restaurando imediatamente a boca ao repouso. A alteração é no controlador de animação; usa o mesmo arquivo Blender da revisão 7.

Revisão 9: controle upperLipRaise independente na face e no interior da boca. O áudio anima o lábio superior com suavização e fechamento nos sons bilabiais. Arquivo Blender: C:/Users/Administrador/Documents/Mariazinha-labio-superior-independente-v9.blend. Prévia local: /teacher-preview.html?v=9. Verificados 8 testes de modelo/controle e reprodução de áudio no navegador, com retorno a zero ao parar.

Revisão 11: dentes superiores com coroas mais curtas, espaços reduzidos, posição recuada e material menos brilhante. Fonte preservada em C:/Users/Administrador/Documents/Mariazinha-dentes-refinados-v11.blend. Verificação de modelo, controle de fala e reprodução no navegador.

Revisão 12: cheekSpeech e cheekLift movem suavemente as duas bochechas conforme abertura e vogais abertas lateralmente. Suavização de 120 ms, regiões de nariz e olhos preservadas, repouso sem oscilação. Fonte: C:/Users/Administrador/Documents/Mariazinha-bochechas-fala-v12.blend. Cinco testes passaram e áudio validado no navegador.

Revisão 13: abertura com perfil curvo mais amplo no lábio inferior, elevação superior distribuída ao redor do centro e interior acompanhando a deformação. Repouso preservado. Fonte: C:/Users/Administrador/Documents/Mariazinha-boca-arqueada-v13.blend.

Revisão 14: abertura inferior ampliada em 42%, aproximando 4 mm adicionais na escala do avatar na pose de fala com jawOpen=0.5. Interior e língua acompanham o perfil. Fonte: C:/Users/Administrador/Documents/Mariazinha-abertura-ampliada-v14.blend.

Revisão 15: elevação vertical do upperLipRaise ampliada em 65% na face e interior, mantendo o perfil arqueado, a abertura inferior e o repouso. Fonte: C:/Users/Administrador/Documents/Mariazinha-labio-elevado-v15.blend.

## Integração dos dois professores

Ambos integrados por padrão na conversação, com controladores isolados e troca que zera os controles anteriores. Prévia oferece seleção dos dois. Suite completa: 98 testes passaram. Reprodução local no navegador confirmou mandíbula, lábio superior, bochechas, piscadas e retorno ao repouso para ambos, sem erros. Isso não verifica uma sessão OpenAI ao vivo nem implanta no CentOS.

Correção de piscadas: capas do Zezinho posicionadas à frente da saliência dos olhos; linha de fechamento e proporção superior/inferior equivalentes à Mariazinha. Verificados aberto, meio fechado e fechado em renders Blender. Fonte preservada: C:/Users/Administrador/Documents/Zezinho-piscada-corrigida.blend. Pacote completo atualizado.
