export function spokenText(value){
 return String(value).replace(/```[\s\S]*?```/g,' ').replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/^\s*(?:#{1,6}\s+|[-*]\s+|\d+[.)]\s+)/gm,'').replace(/(?:^|\n)\s*[-_]{3,}\s*(?=\n|$)/g,' ').replace(/(?:^|\s)[-_]{3,}(?=\s|$)/g,' ').replace(/[*_`]/g,'').replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu,' ').replace(/\s+/g,' ').trim();
}
