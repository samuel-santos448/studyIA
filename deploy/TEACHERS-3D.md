# Professores 3D

Zezinho e Mariazinha usam duas variantes de uma base humana CC0, enquadradas
do peito para cima. Cabelo curto/alongado, roupa azul/verde e formato do maxilar
distinguem os personagens. O navegador renderiza o modelo com Three.js e
anima piscadas, respiração, cabeça, braços e expressões ao ouvir e pensar.
É uma primeira versão com base compartilhada, preparada para futura troca
por modelos próprios da escola.

Os arquivos ficam no servidor StudyIA; não há CDN, serviço de avatar externo
nem cobrança adicional por minuto de animação. O arquivo humano tem cerca
de 9 MB e é compartilhado pelos dois personagens. A voz continua usando a
OpenAI e sua cobrança habitual. Não é necessário instalar GPU na VM:
o processamento gráfico e de animação ocorre no computador do aluno.

HeadAudio estima formatos da boca a partir do áudio recebido por WebRTC,
sem transcrição e sem enviar áudio a outro serviço. Essa estimativa não é
sincronização fonética perfeita e é treinada para inglês. Se AudioWorklet
estiver indisponível, a mandíbula acompanha o volume da voz. Se WebGL falhar,
o desenho SVG é exibido e a conversa continua funcionando.

O 3D pausa fora da área visível; o modo de movimento reduzido remove balanços
de cabeça e braços. Microfone, permissões, login e contexto das aulas seguem
a integração existente. HTTPS continua necessário para acesso ao microfone.

Dependências são fixadas no package-lock.json. Three.js é dependência de
produção. Sharp é usado somente na preparação dos arquivos (dependência de
desenvolvimento) e não entra no container de produção. Licenças e origem
dos arquivos: assets/teachers/NOTICE.md.

## Atualização na VM

```bash
cd /opt/studyia
git pull --ff-only origin main
docker compose up -d --build app proxy
docker compose ps
```

Atualize a página com Ctrl+F5 e abra Conversação. O modelo carrega antes de
iniciar a conversa. Confira os dois professores; após entrar na conta,
inicie a conversa normalmente. Não há nova variável de ambiente nem migração
de banco nesta atualização.
