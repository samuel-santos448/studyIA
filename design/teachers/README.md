# Produção dos professores do StudyIA

Estado: direção visual aprovada; modelos 3D ainda não produzidos.

Os avatares atuais da aplicação permanecem ativos. Este pacote contém referências
para a produção de Zezinho e Mariazinha. As imagens não são malhas, arquivos GLB,
animações ou provas de que os modelos já existem.

## Referências visuais

- [Proposta aprovada](proposta-aprovada.png): referência principal para rosto,
  acabamento, cores, cabelo, expressão e roupa.
- [Zezinho](zezinho-referencia-modelagem.png): vistas de frente, perfil, costas,
  três quartos e referências de expressões.
- [Mariazinha](mariazinha-referencia-modelagem.png): as mesmas vistas e expressões.
- [Logo original](school-logo-original.jpg): arte a aplicar nas roupas.
- Imagens individuais para enviar ao gerador: [Zezinho](zezinho-upload-3d.png)
  e [Mariazinha](mariazinha-upload-3d.png). Cada arquivo contém apenas um personagem.
- [Pesquisa de ferramentas e instruções](FERRAMENTAS.md).

As fichas foram geradas com imagegen no modo integrado, usando a proposta aprovada
e o logo original como referências. Os prompts estão em [PROMPTS.md](PROMPTS.md).
As vistas são referências artísticas aproximadas; o modelador deve resolver a
consistência tridimensional. Havendo diferenças entre as fichas e a proposta
aprovada, prevalece a proposta aprovada. A arte original do logo prevalece sobre
qualquer interpretação nas imagens geradas.

## Direção artística

Dois adultos com aparência de personagens de animação 3D, simpáticos e seguros
ao ensinar. Preservar olhos castanhos expressivos com pálpebras integradas, pele
com transições suaves, nariz e lábios esculpidos, cabelos com volume e curvas,
pescoço e ombros naturais, mãos com cinco dedos e roupa com caimento.

Zezinho: cabelo castanho escuro curto e ondulado, penteado lateral, sobrancelhas
mais marcadas, mandíbula suave; camisa azul-marinho sobre camiseta clara.
Mariazinha: rosto oval, cabelo castanho escuro em corte médio com camadas e
pontas curvas, brincos pequenos e camisa verde com gola.
Ambos usam o logo da escola no lado esquerdo do peito.

Evitar olhos esféricos saltados, cabelo de tubos rígidos, ombros inflados,
articulações de brinquedo e sorriso permanentemente escancarado. Uma aproximação
com primitivas geométricas já foi rejeitada pelo usuário.

Calças e calçados das fichas completam a vista de corpo inteiro e podem ser
ajustados durante a produção. O enquadramento principal da aplicação é do peito
para cima, com espaço lateral para gestos de explicação.

## Entregas solicitadas à produção 3D

1. Arquivo-fonte editável de cada personagem, com materiais, texturas e rig.
2. `zezinho.glb` e `mariazinha.glb`, em glTF 2.0, contendo malha, texturas,
   esqueleto, controles faciais e clipes de animação.
3. Vídeo de revisão de cada personagem: frontal e três quartos, seguido de
   piscada, sorriso, escuta, fala com áudio e gesto de explicação.
4. Licença ou autorização que permita usar e distribuir os modelos e texturas
   no StudyIA, inclusive no navegador dos alunos.

Etapas recomendadas: esculpir os rostos e cabelos; aprovar a aparência com
renders; preparar topologia e texturas; montar rig e controles faciais; produzir
os clipes; exportar e revisar no navegador. Uma malha obtida por imagem para 3D
pode exigir correção artística, retopologia e rig facial antes da integração.

## Contrato inicial para integração

Este contrato define o que pedir à produção; não ativa um carregador novo na
aplicação. Quando houver modelos reais, a integração poderá adaptar nomes
equivalentes do rig mediante um mapa explícito.

- Unidades em metros, Y para cima, personagem de frente para +Z.
- Origem no chão entre os pés, pose-base A, transformações aplicadas.
- Texturas incorporadas ao GLB; nenhuma dependência de URL externa.
- Materiais PBR com mapa de cor em sRGB, roughness, normal e alpha quando necessário.
- Meta inicial: até 100 mil triângulos e 20 MiB por personagem; texturas de até
  2048 px. Esses são limites de projeto, a confirmar por medição no navegador.
- Cabelo com boa silhueta, sem simulação física obrigatória; olhos e dentes
  separados, sem atravessar pálpebras ou lábios.
- Ossos mínimos: `Head`, `Neck`, `Spine2`, `LeftArm`, `RightArm`,
  `LeftForeArm`, `RightForeArm`, `LeftHand`, `RightHand`.
- Dedos articulados, incluindo polegar; o produtor deve documentar os nomes.
- Expressões faciais por morph targets, interpoláveis de 0 a 1, com o nome
  gravado em `mesh.extras.targetNames` no GLB.

Controles mínimos do rosto:

```text
eyeBlinkLeft eyeBlinkRight
eyeLookInLeft eyeLookInRight eyeLookOutLeft eyeLookOutRight
eyeSquintLeft eyeSquintRight
browInnerUp mouthSmileLeft mouthSmileRight jawOpen
viseme_sil viseme_PP viseme_FF viseme_TH viseme_DD
viseme_kk viseme_CH viseme_SS viseme_nn viseme_RR
viseme_aa viseme_E viseme_I viseme_O viseme_U
```

Clipes de animação: `idle`, `listening`, `thinking`, `explaining`, `greeting`.
Os clipes corporais não devem gravar a abertura da boca: a fala será conduzida
pelo áudio recebido na conversação. Os clipes devem permitir transições suaves
e não deslocar o personagem para fora do enquadramento.

## Validação técnica de uma entrega futura

```bash
node scripts/validate-teacher-models.mjs caminho/zezinho.glb caminho/mariazinha.glb
```

O script confere o contêiner GLB, recursos incorporados, presença de malha com
skin, ossos mínimos, controles de rosto, clipes e limites de tamanho e triângulos.
Ele não substitui a revisão visual nem garante a qualidade do rig. A aprovação
final requer comparar os modelos com a proposta aprovada e testar fala, piscadas,
gestos, celular e modo de movimento reduzido no navegador.
