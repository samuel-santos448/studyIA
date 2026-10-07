# Professores 3D estilizados

Zezinho e Mariazinha agora usam personagens paramétricos originais do StudyIA,
construídos em teacher-character.mjs. A versão anterior, baseada em uma malha
humana CC0, foi substituída na renderização por rostos estilizados, olhos maiores,
cabelos com volume, uniformes e mãos articuladas. É uma interpretação em tempo
real do estilo solicitado; o acabamento não equivale a uma produção cinematográfica.

Os controles faciais incluem piscadas, olhar, sobrancelhas, sorriso e formatos
relativos da boca. teacher-face.mjs converte os 15 visemas do HeadAudio em abertura,
arredondamento, largura e pressão dos lábios. teacher-motion.mjs interpola os
estados de espera, escuta, pensamento e fala. Os braços, punhos e dedos acompanham
gestos de explicação. Em movimento reduzido, os gestos decorativos são removidos.

O logo original school-logo.jpg fica em um patch curvo no peito, que acompanha
a roupa. As duas variantes têm cabelo, proporções faciais, cores de uniforme e
golas distintos. O navegador gera as geometrias e a textura da íris localmente;
não é preciso baixar o antigo arquivo humano de 9,5 MB para exibir os professores.
A versão antiga e sua atribuição permanecem no repositório como referência.

Three.js, HeadAudio e os arquivos da escola são hospedados pelo StudyIA. Não há
CDN, conta em serviço de avatar ou cobrança adicional por minuto de animação.
A voz mantém a integração OpenAI existente e sua cobrança habitual. Nenhuma GPU
precisa ser instalada na VM; a renderização ocorre no navegador do aluno.

HeadAudio estima os formatos da boca a partir do áudio recebido por WebRTC,
sem transcrição e sem enviar áudio a outro serviço. Essa estimativa não é uma
sincronização fonética perfeita e o classificador é treinado para inglês.
Se AudioWorklet não estiver disponível, a boca acompanha o volume da voz.
Se WebGL falhar, o desenho SVG com o logo aparece e a conversa continua.
O processamento 3D pausa fora da área visível. Login, microfone, HTTPS, contexto
das aulas e o serviço de voz seguem as configurações existentes.

A validação abrangeu as duas variantes, voz com áudio simulado, interrupção,
liberação dos recursos, celular, movimento reduzido e ausência de WebGL.
Uma conversa real com OpenAI depende de login, chave, permissões e rede do ambiente.

## Atualização na VM

```bash
cd /opt/studyia
git pull --ff-only origin main
docker compose up -d --build app proxy
docker compose ps
```

Atualize a página com Ctrl+F5 e abra Conversação. Não há nova variável de ambiente
nem migração do banco. Dependências estão fixadas no package-lock.json. Licenças
e origem dos arquivos: assets/teachers/NOTICE.md.
