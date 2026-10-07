# Pesquisa de ferramentas para produzir os professores

Consulta a páginas oficiais em 7 de outubro de 2026. Não foram criadas contas,
assinaturas ou modelos nessas plataformas. Os resultados e a compatibilidade
com o StudyIA ainda precisam ser testados usando arquivos exportados reais.

## Candidato principal: Hyper3D ChatAvatar

É o candidato mais alinhado ao uso de conversação, com base nos recursos
declarados pelo fabricante: geração a partir de imagens, avatares estilizados,
rosto e corpo, materiais PBR, controles faciais, blendshapes, expressões ARKit,
visemas e sincronização labial. Isso é uma avaliação da documentação, não um
teste da qualidade nem uma garantia de reproduzir exatamente a proposta.

[Produto e capacidades](https://hyper3d.ai/features/chatavatar?lang=en).

A página de preços lista Business por US$ 120/mês na cobrança mensal, ou
US$ 96/mês equivalentes em cobrança anual. Nesse plano, declara prévia 3D
antes da compra e licença comercial ChatAvatar. A página não esclarece um
preço final por personagem exportado; confirmar esse valor e o formato de
exportação antes de pagar. Não presumir que os US$ 30/mês do Creator/Rodin
incluem a mesma entrega de ChatAvatar.

[Preços e licença](https://hyper3d.ai/pricing?lang=en).

## Alternativas para comparar a aparência

| Ferramenta | Recursos confirmados nas páginas oficiais | Limite da pesquisa |
| --- | --- | --- |
| Meshy | Image to 3D, pose A/T, texturas, exportação GLB e rig de humanoides | A API documenta esqueleto corporal; não estabelece a entrega dos controles faciais específicos exigidos pelo StudyIA. Há uma página comercial que anuncia blendshapes; confirmar no arquivo real, não presumir. |
| Tripo | Imagem para 3D, vistas múltiplas, rig e animação corporal | Não foi confirmada na documentação técnica consultada a entrega do conjunto de controles faciais para conversa. |

Meshy: [Image to 3D](https://docs.meshy.ai/en/webapp/image-to-3d),
[API de rig](https://docs.meshy.ai/en/api/rigging),
[anúncio de blendshapes](https://www.meshy.ai/use-cases/free-game-assets/character-rigging),
[formatos e preços](https://www.meshy.ai/pricing/).

Tripo: [Auto Rig](https://developers.tripo3d.ai/en/docs/animations-rig),
[preços](https://www.tripo3d.ai/pricing). O plano gratuito lista 200 créditos
mensais, modelos públicos e uso não comercial. O Pro exibido lista US$ 20/mês
equivalentes, cobrados como US$ 240/ano; não confundir esse valor com uma
assinatura mensal sem compromisso anual.

## Primeiro teste sugerido

1. Abrir o produto escolhido e entrar com sua conta.
2. Começar com **um** personagem, usando `zezinho-upload-3d.png` como referência.
   Não enviar a prancha com oito vistas para uma entrada que aceita apenas uma
   imagem de um personagem. Usar as vistas adicionais somente quando houver
   campos próprios de multi-view.
3. Selecionar criação de avatar/personagem estilizado, preservando o desenho.
4. Inspecionar a prévia de frente e três quartos, incluindo cabelo, olhos,
   sorriso, roupa, dedos e logo. Compare com `proposta-aprovada.png`.
5. Confirmar que a entrega preserva o rig facial e corporal na exportação.
   Preferir GLB com texturas incorporadas. Se houver apenas FBX, guardar FBX e
   texturas; será necessário converter e verificar os controles no GLB.
6. Só considerar a aquisição da entrega depois de verificar aparência, licença,
   preço final e controles de boca/pálpebras. Uma prévia em vídeo não demonstra
   que o arquivo exportado contém esses controles.
7. Entregar o arquivo para validar e adaptar ao StudyIA. Repetir com Mariazinha
   depois de aprovar o primeiro modelo.

Texto de orientação para copiar na geração, quando houver campo de prompt:

```text
Create an original stylized adult virtual teacher matching the supplied reference.
Preserve the approved face, hairstyle, natural eyelids, adult body proportions,
clothing and school logo. Keep a neutral closed-mouth A-pose.
For real-time talking-avatar use, preserve separate eyes and mouth interior,
facial blendshapes for blinking, smiling, jaw opening, lip rounding and visemes,
and a humanoid body rig with articulated fingers. Export an editable model and
an optimized GLB with embedded textures and preserved facial controls.
Avoid bulging spherical eyes, toy joints, inflated shoulders and rigid tube hair.
```

O prompt comunica a necessidade; não cria recursos que a ferramenta não oferece.
Nomes ARKit ou outros controles equivalentes poderão ser mapeados na integração,
sem obrigar o gerador a fornecer exatamente os nomes do contrato inicial.
