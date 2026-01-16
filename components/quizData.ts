export type QuestionOption = {
  label: string;
  value: number;
  description?: string;
};

export type SubQuestion = {
  id: string;
  subArea: string;
  question: string;
  explanation: string;
  requiresTeam?: boolean;
};

export type QuizSection = {
  id: string;
  title: string;
  description: string;
  questions: SubQuestion[];
  skippable?: boolean;
};

export const QUIZ_DATA: QuizSection[] = [
  {
    id: 'governanca',
    title: 'Governança e Compliance',
    description: 'Avaliando a segurança jurídica, societária e a gestão de riscos do negócio.',
    questions: [
      { 
        id: 'gov_riscos', 
        subArea: 'Gestão de Riscos', 
        question: 'Existe um mapeamento de ameaças (operacionais/financeiras) que podem paralisar o negócio?', 
        explanation: 'Identificar vulnerabilidades críticas antes que aconteçam.' 
      },
      { 
        id: 'gov_societaria', 
        subArea: 'Estrutura Societária', 
        question: 'Há clareza documental nos papéis dos sócios e acordos de cotistas assinados?', 
        explanation: 'Evita disputas futuras e define responsabilidades claras.' 
      },
      { 
        id: 'gov_financas', 
        subArea: 'Separação das Finanças', 
        question: 'As contas bancárias e despesas pessoais dos sócios são 100% separadas das da empresa?', 
        explanation: 'Essencial para a saúde fiscal e visão real do lucro.' 
      },
      { 
        id: 'gov_nr1', 
        subArea: 'Conformidade Legal (NR1)', 
        question: 'A empresa cumpre todas as normas regulatórias e de segurança para evitar multas?', 
        requiresTeam: true, 
        explanation: 'Segurança jurídica e proteção contra passivos trabalhistas.' 
      },
      { 
        id: 'gov_ferramentas', 
        subArea: 'Governança Corporativa', 
        question: 'Existem ferramentas formais de controle e rituais de acompanhamento de indicadores?', 
        explanation: 'Garante que a gestão não dependa apenas da presença do dono.' 
      },
    ]
  },
  {
    id: 'estrategia',
    title: 'Estratégia e Planejamento',
    description: 'Avaliando a clareza da visão de futuro e o modelo de negócios.',
    questions: [
      { 
        id: 'est_okr', 
        subArea: 'Visão de Futuro', 
        question: 'Estão definidas as metas de curto, médio e longo prazo (OKRs)?', 
        explanation: 'Alinha toda a equipe em uma única direção estratégica.' 
      },
      { 
        id: 'est_valor', 
        subArea: 'Diferenciação de Mercado', 
        question: 'A proposta de valor única frente aos concorrentes é clara para todos?', 
        explanation: 'Define por que o cliente escolhe você e não o concorrente.' 
      },
      { 
        id: 'est_modelo', 
        subArea: 'Modelo de Negócios', 
        question: 'Existe clareza total sobre o modelo de operação e geração de valor da empresa?', 
        explanation: 'Entendimento profundo de como a receita é gerada e escalada.' 
      },
      { 
        id: 'est_expansao', 
        subArea: 'Roteiro de Expansão', 
        question: 'Existe um plano de crescimento escalável desenhado sem perda de qualidade?', 
        explanation: 'Crescer com sustentabilidade para não quebrar a operação.' 
      },
    ]
  },
  {
    id: 'tecnologia',
    title: 'Tecnologia',
    description: 'Avaliando a infraestrutura digital, segurança e automação.',
    questions: [
      { 
        id: 'tec_sistemas', 
        subArea: 'Sistemas', 
        question: 'Os softwares atuais (ERP, CRM, BI) atendem plenamente às necessidades da empresa?', 
        explanation: 'Ferramentas integradas aumentam a produtividade e reduzem erros.' 
      },
      { 
        id: 'tec_automacao', 
        subArea: 'Automação de Processos', 
        question: 'Qual o nível de substituição de tarefas manuais por fluxos digitais/automáticos?', 
        explanation: 'Libera o time de tarefas repetitivas para focar em estratégia.' 
      },
      { 
        id: 'tec_dados', 
        subArea: 'Segurança de Dados', 
        question: 'Existe proteção profissional para informações sensíveis da empresa e clientes?', 
        explanation: 'Protege contra ataques cibernéticos e vazamento de dados (LGPD).' 
      },
      { 
        id: 'tec_infra', 
        subArea: 'Infraestrutura', 
        question: 'O hardware e a rede atuais garantem a eficiência que a empresa busca?', 
        explanation: 'Equipamentos lentos são um gargalo invisível de produtividade.' 
      },
    ]
  },
  {
    id: 'comercial',
    title: 'Comercial',
    description: 'Avaliando a máquina de vendas, processos e indicadores de conversão.',
    questions: [
      { 
        id: 'com_processo', 
        subArea: 'Processo de Vendas', 
        question: 'As etapas de conversão (do lead ao fechamento) estão padronizadas e documentadas?', 
        explanation: 'Garante previsibilidade e facilita o treinamento de novos vendedores.' 
      },
      { 
        id: 'com_crm', 
        subArea: 'Gestão de Oportunidades (CRM)', 
        question: 'Existe visibilidade total das oportunidades em aberto e taxas de conversão?', 
        explanation: 'Sem CRM, você perde dinheiro esquecendo de fazer follow-up.' 
      },
      { 
        id: 'com_posvenda', 
        subArea: 'Pós-venda e Upsell', 
        question: 'Existem estratégias ativas para vender mais vezes para o mesmo cliente (LTV)?', 
        explanation: 'Aumentar o valor vitalício do cliente é mais barato que adquirir novos.' 
      },
      { 
        id: 'com_kpis', 
        subArea: 'Indicadores Comerciais', 
        question: 'Os KPIs comerciais são claros e usados para tomada de decisão?', 
        explanation: 'Gestão baseada em dados, não em intuição.' 
      },
      { 
        id: 'com_metas', 
        subArea: 'Metas de Vendas', 
        question: 'As metas são realistas, baseadas em dados e comunicadas à equipe?', 
        explanation: 'Metas inatingíveis desmotivam; metas fáceis acomodam.' 
      },
      { 
        id: 'com_preco', 
        subArea: 'Precificação', 
        question: 'Existe um sistema profissional de precificação que garante margem e lucro?', 
        explanation: 'Vender com preço errado pode gerar prejuízo a cada venda realizada.' 
      },
      { 
        id: 'com_gov', 
        subArea: 'Governança Comercial', 
        question: 'Existe gestão e acompanhamento constante da performance do time de vendas?', 
        explanation: 'O olho do dono (ou do gestor) mantém o ritmo da equipe.' 
      },
    ]
  },
  {
    id: 'marketing',
    title: 'Marketing',
    description: 'Avaliando a atração de clientes e posicionamento de marca.',
    questions: [
      { 
        id: 'mkt_leads', 
        subArea: 'Aquisição de Leads', 
        question: 'Os canais de atração de novos clientes são previsíveis e eficientes?', 
        explanation: 'Não depender apenas de indicações para crescer.' 
      },
      { 
        id: 'mkt_marca', 
        subArea: 'Posicionamento de Marca', 
        question: 'A percepção da marca no mercado digital e offline é a desejada?', 
        explanation: 'Uma marca forte permite cobrar mais caro (prêmio de preço).' 
      },
      { 
        id: 'mkt_roi', 
        subArea: 'Métricas de Retorno (ROI)', 
        question: 'O retorno sobre o investimento em anúncios é medido e analisado?', 
        explanation: 'Saber exatamente quanto volta para cada real investido.' 
      },
    ]
  },
  {
    id: 'financeiro',
    title: 'Financeiro',
    description: 'Avaliando a saúde do fluxo de caixa e rotinas financeiras.',
    questions: [
      { 
        id: 'fin_pagar', 
        subArea: 'Contas a Pagar', 
        question: 'Existe um processo claro, digital e eficaz para gestão de pagamentos?', 
        explanation: 'Evita multas por atraso e desorganização do caixa.' 
      },
      { 
        id: 'fin_receber', 
        subArea: 'Contas a Receber', 
        question: 'O processo de recebíveis é organizado para evitar inadimplência?', 
        explanation: 'Garante que o dinheiro das vendas realmente entre no caixa.' 
      },
      { 
        id: 'fin_caixa', 
        subArea: 'Fluxo de Caixa', 
        question: 'As entradas e saídas diárias são geridas para garantir liquidez total?', 
        explanation: 'Sobrevivência do negócio: não deixar faltar dinheiro para operar.' 
      },
      { 
        id: 'fin_orcamento', 
        subArea: 'Planejamento Orçamentário', 
        question: 'Existe controle de gastos "Previsto vs. Realizado"?', 
        explanation: 'Evita surpresas no fim do mês comparando a meta com a realidade.' 
      },
      { 
        id: 'fin_conciliacao', 
        subArea: 'Conciliação Bancária', 
        question: 'A conferência entre o extrato e o sistema é feita diariamente?', 
        explanation: 'Auditoria diária para garantir que nenhum centavo se perdeu.' 
      },
      { 
        id: 'fin_credito', 
        subArea: 'Crédito e Cobrança', 
        question: 'Existe uma política estruturada para concessão de crédito e cobrança ativa?', 
        explanation: 'Reduz o risco de calotes e melhora o capital de giro.' 
      },
      { 
        id: 'fin_relatorios', 
        subArea: 'Relatórios Financeiros', 
        question: 'Os relatórios são gerados com precisão e pontualidade para análise?', 
        explanation: 'Dados financeiros confiáveis são a bússola da empresa.' 
      },
    ]
  },
  {
    id: 'controladoria',
    title: 'Controladoria',
    description: 'Avaliando a inteligência de dados financeiros e auditoria.',
    questions: [
      { 
        id: 'ctrl_margem', 
        subArea: 'Análise de Margens', 
        question: 'Você conhece a lucratividade real por cada produto ou serviço vendido?', 
        explanation: 'Focar no que dá lucro, não apenas no que dá faturamento.' 
      },
      { 
        id: 'ctrl_kpis', 
        subArea: 'Indicadores (KPIs)', 
        question: 'Métricas como EBITDA e Lucratividade Líquida são monitoradas mensalmente?', 
        explanation: 'Indicadores de saúde real do negócio.' 
      },
      { 
        id: 'ctrl_auditoria', 
        subArea: 'Auditoria Interna', 
        question: 'Há verificação periódica da integridade dos registros e processos?', 
        explanation: 'Prevenção contra fraudes e erros operacionais.' 
      },
      { 
        id: 'ctrl_meta_fin', 
        subArea: 'Meta Financeira', 
        question: 'Existem metas financeiras claras além do simples faturamento?', 
        explanation: 'Metas de lucro líquido, redução de custos e rentabilidade.' 
      },
      { 
        id: 'ctrl_equilibrio', 
        subArea: 'Ponto de Equilíbrio', 
        question: 'O valor mínimo de faturamento para não ter prejuízo é conhecido?', 
        explanation: 'O número mágico que a empresa precisa atingir para começar a lucrar.' 
      },
      { 
        id: 'ctrl_custos', 
        subArea: 'Gestão de Custos e Despesas', 
        question: 'Existe uma análise crítica e periódica para redução de custos?', 
        explanation: 'Eficiência operacional: fazer mais com menos.' 
      },
      { 
        id: 'ctrl_contabil', 
        subArea: 'Análise Contábil', 
        question: 'São feitas análises verticais e horizontais dos balancetes contábeis?', 
        explanation: 'A contabilidade como ferramenta gerencial, não apenas fiscal.' 
      },
      { 
        id: 'ctrl_apresentacao', 
        subArea: 'Relatórios de Controladoria', 
        question: 'Os indicadores de performance são apresentados de forma clara para os sócios?', 
        explanation: 'Transparência e segurança para os investidores/sócios.' 
      },
    ]
  },
  {
    id: 'fiscal',
    title: 'Fiscal e Contábil',
    description: 'Avaliando a eficiência tributária e conformidade fiscal.',
    questions: [
      { 
        id: 'fisc_planejamento', 
        subArea: 'Planejamento Tributário', 
        question: 'Existe uma estratégia anual para reduzir legalmente o pagamento de impostos?', 
        explanation: 'Elisão fiscal: pagar menos impostos dentro da lei.' 
      },
      { 
        id: 'fisc_saude', 
        subArea: 'Saúde Contábil', 
        question: 'A movimentação bancária bate 100% com o que é enviado para a contabilidade?', 
        explanation: 'Evita problemas sérios com a Receita Federal.' 
      },
      { 
        id: 'fisc_tributos', 
        subArea: 'Gestão de Tributos', 
        question: 'Os impostos são calculados e pagos com precisão e pontualidade?', 
        explanation: 'Evita multas pesadas e juros desnecessários.' 
      },
    ]
  },
  {
    id: 'capital_humano',
    title: 'Capital Humano',
    description: 'Avaliando a gestão de pessoas e talentos.',
    skippable: true,
    questions: [
      { 
        id: 'rh_recrutamento', 
        subArea: 'Recrutamento e Seleção', 
        question: 'Existe um método para atrair e contratar os talentos certos?', 
        explanation: 'Contratar a pessoa certa para o lugar certo.' 
      },
      { 
        id: 'rh_cargos', 
        subArea: 'Plano de Cargos e Salários', 
        question: 'Há clareza sobre evolução de carreira e remuneração na empresa?', 
        explanation: 'Retém talentos mostrando futuro dentro da organização.' 
      },
      { 
        id: 'rh_treinamento', 
        subArea: 'Treinamento e Desenvolvimento', 
        question: 'Existe investimento contínuo na capacitação técnica do time?', 
        explanation: 'Equipe qualificada produz mais e melhor.' 
      },
      { 
        id: 'rh_beneficios', 
        subArea: 'Benefícios', 
        question: 'A política de benefícios é competitiva para atrair e reter talentos?', 
        explanation: 'Torna a empresa desejada pelos melhores profissionais.' 
      },
      { 
        id: 'rh_bonus', 
        subArea: 'Bônus e Prêmios', 
        question: 'Existem rituais de premiação por performance alcançada?', 
        explanation: 'Meritocracia: recompensar quem traz resultados.' 
      },
      { 
        id: 'rh_clima', 
        subArea: 'Ambiente e Clima', 
        question: 'O clima organizacional é medido e gerido para evitar conflitos e desmotivação?', 
        explanation: 'Ambiente saudável retém pessoas e aumenta produtividade.' 
      },
      { 
        id: 'rh_psico', 
        subArea: 'Riscos Psicossociais', 
        question: 'A empresa atua preventivamente contra estresse e doenças ocupacionais?', 
        explanation: 'Cuidado com a saúde mental do time.' 
      },
    ]
  },
  {
    id: 'cultura',
    title: 'Cultura Organizacional',
    description: 'Avaliando o alinhamento de valores e autonomia.',
    skippable: true,
    questions: [
      { 
        id: 'cult_valores', 
        subArea: 'Valores e Propósito', 
        question: 'A equipe age de acordo com a cultura e valores definidos pelo dono?', 
        explanation: 'Alinhamento comportamental com a visão da empresa.' 
      },
      { 
        id: 'cult_rituais', 
        subArea: 'Rituais de Gestão', 
        question: 'Existem reuniões e feedbacks constantes que mantêm o alinhamento?', 
        explanation: 'Comunicação constante para corrigir rotas e alinhar expectativas.' 
      },
      { 
        id: 'cult_autogestao', 
        subArea: 'Autogestão', 
        question: 'O time tem maturidade para entregar resultados sem supervisão direta do dono?', 
        explanation: 'O objetivo final: a empresa que funciona sem o dono operacional.' 
      },
    ]
  }
];

export const AREA_INSIGHTS: Record<string, string> = {
  governanca: "Sua empresa está exposta a riscos desnecessários. A falta de governança pode gerar conflitos societários e passivos trabalhistas que inviabilizam a venda ou o crescimento do negócio.",
  estrategia: "Você está operando no 'piloto automático'. Sem uma visão clara de futuro e diferenciação, sua empresa corre o risco de virar commodity e brigar apenas por preço.",
  tecnologia: "Sua operação é lenta e manual. A falta de tecnologia integrada está drenando a produtividade da equipe e gerando cegueira de dados para a tomada de decisão.",
  comercial: "Sua máquina de vendas engasga. Sem um processo previsível e documentado, o faturamento depende do talento individual ou da sorte, impedindo a escala.",
  marketing: "Sua marca é invisível ou mal posicionada. Depender apenas de indicações limita seu teto de crescimento. É preciso criar canais de aquisição previsíveis.",
  financeiro: "Alerta vermelho no caixa. A desorganização financeira impede que você saiba se teve lucro ou prejuízo real no mês, colocando a sobrevivência da empresa em jogo.",
  controladoria: "Você está dirigindo no escuro. Sem indicadores de margem e DRE, você pode estar vendendo muito e perdendo dinheiro na operação sem perceber.",
  fiscal: "Risco de passivo oculto. A falta de planejamento tributário e conciliação pode estar custando caro em impostos indevidos ou gerando multas futuras.",
  capital_humano: "Sua equipe não joga junto. Problemas de contratação e falta de clareza nos cargos geram rotatividade alta e baixa produtividade.",
  cultura: "A empresa depende 100% de você. A falta de rituais e cultura forte impede que o time tenha autonomia, tornando você um escravo do próprio negócio."
};