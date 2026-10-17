import { Skill, UserSettings } from '../types';

export interface PromptBuildOptions {
  skill: Skill;
  inputs: Record<string, any>;
  settings: UserSettings;
  targetModel: 'claude' | 'gemini' | 'chatgpt';
}

export const promptEngine = {
  buildPrompt({ skill, inputs, settings, targetModel }: PromptBuildOptions): string {
    let rawContent = '';
    
    if (skill.promptTemplate) {
      rawContent = skill.promptTemplate(inputs, settings);
    } else {
      const baseCommand = (skill.commands && skill.commands.length > 0) 
        ? skill.commands[0] 
        : `Elabore o documento ${skill.documentType || skill.name} com base nos parâmetros agronômicos fornecidos.`;
        
      const lines: string[] = [];
      lines.push(baseCommand);
      lines.push('');
      lines.push('# CONTEXTO TÉCNICO');
      lines.push(`Departamento: ${skill.categoryLabel} | Documento a produzir: ${skill.documentType || skill.name}`);
      lines.push(`Objetivo da Skill: ${skill.summary}`);
      if (skill.context && skill.context.length > 0) {
        skill.context.forEach(c => lines.push(`- ${c}`));
      }
      lines.push('');

      lines.push('# DADOS E VARIÁVEIS DE CAMPO INFORMADAS');
      let filledCount = 0;
      skill.fields.forEach(f => {
        if (f.id === 'field_extra') return;
        const val = inputs[f.id];
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          lines.push(`${f.label}: ${val}`);
          filledCount++;
        } else {
          lines.push(`${f.label}: [NÃO INFORMADO]`);
        }
      });

      if (inputs.field_extra && String(inputs.field_extra).trim() !== '') {
        lines.push(`Observações adicionais de campo: ${inputs.field_extra}`);
      }
      lines.push('');

      if (skill.outputStructure && skill.outputStructure.length > 0) {
        lines.push('# ESTRUTURA OBRIGATÓRIA DA RESPOSTA');
        skill.outputStructure.forEach((s, idx) => lines.push(`${idx + 1}. ${s}`));
        lines.push('');
      }

      if (skill.diagnostics && skill.diagnostics.length > 0) {
        lines.push('# PERGUNTAS DE DIAGNÓSTICO E CRITÉRIOS DE AVALIAÇÃO');
        lines.push('Antes de emitir o documento final, avalie estas questões críticas de campo:');
        skill.diagnostics.forEach(d => lines.push(`- ${d}`));
        lines.push('');
      }

      lines.push('# REGRAS E DIRETRIZES DE RIGOR TÉCNICO');
      lines.push('- Utilize exclusivamente as informações fornecidas acima. Não invente dados numéricos, doses de defensivos, produtos comerciais, produtividades ou preços.');
      lines.push('- Toda recomendação de aplicação ou correção deve mencionar a necessidade de conferência de bula oficial/Agrofit e receituário emitido por profissional habilitado.');
      lines.push('- Destaque de forma expressa quais pontos necessitam de validação ou verificação documental in loco.');

      rawContent = lines.join('\n');
    }

    const modelHeader = this.getModelInstructions(targetModel);
    const disclaimerBlock = settings.includeDisclaimer
      ? `\n---
[DIRETRIZ DE RESPONSABILIDADE TÉCNICA E NORMATIVA]
Este parecer/documento gerado por IA serve como subsídio analítico preliminar. A validação agronômica em campo, assinatura técnica, emissão de receituário agronômico e ART (Anotação de Responsabilidade Técnica perante o CREA/CONFEA) são prerrogativas exclusivas do Engenheiro Agrônomo habilitado (${settings.agronomistName || 'Eng. Agrônomo'} - ${settings.creaNumber || 'CREA Habilitado'}).
`
      : '';

    return `${modelHeader}

${rawContent}
${disclaimerBlock}`;
  },

  getModelInstructions(model: 'claude' | 'gemini' | 'chatgpt'): string {
    switch (model) {
      case 'claude':
        return `<!-- DIRETRIZES DE PROCESSAMENTO CLAUDE 3.7 / 3.5 SONNET -->
Você atuará com profundidade técnica agronômica máxima. Não resuma nem omita cálculos estequiométricos ou tabelas comparativas. Adote tom executivo, formal e estritamente embasado em literatura da Embrapa, IAC e MAPA.`;
      case 'gemini':
        return `# DIRETRIZES DE PROCESSAMENTO GEMINI 2.5 PRO
Instrução de Execução: Processe as variáveis agronômicas com raciocínio analítico estruturado. Apresente os dados em tabelas limpas de Markdown e liste as recomendações operacionais em sequência cronológica de prioridade de campo.`;
      case 'chatgpt':
        return `[INSTRUÇÃO PARA O MODELO]
Atue como Especialista Sênior em Agronomia e Gestão Agropecuária. Responda estruturando as seções com cabeçalhos claros, tabelas comparativas e planos de ação práticos para aplicação em campo.`;
      default:
        return '';
    }
  }
};
