export interface BotConfig {
  id: string;
  name: string;
  module: string;
  program: string;
  assistantId: string;
  description: string;
  samplePrompts: string[];
  instructor: string;
  backgroundColor: string;
  primaryColor: string;
}

export const bots: BotConfig[] = [
  {
    id: 'OmarBotGMBAMM',
    name: 'OmarBot Marketing Management',
    module: 'Marketing Management',
    program: 'Global MBA',
    assistantId: 'asst_wIfbP6ZwBTsQrASEkj3XmEDq',
    instructor: 'Omar Merlo Support Bot',
    description: 'Get expert guidance on marketing management concepts, strategies, and best practices. This AI assistant is trained to help with your Marketing Management studies.',
    backgroundColor: 'from-blue-50 to-indigo-50',
    primaryColor: 'blue',
    samplePrompts: [
      "Explain the difference between B2B and B2C marketing strategies",
      "What are the key components of a successful marketing mix (4Ps)?",
      "How does digital marketing differ from traditional marketing approaches?",
      "Can you help me understand consumer behavior and decision-making processes?"
    ]
  },
  {
    id: 'OmarBotGMBABM',
    name: 'OmarBot Brand Management',
    module: 'Brand Management',
    program: 'Global MBA',
    assistantId: 'asst_2YgIQdCZLTzPsW5LeiZAKpSU',
    instructor: 'Omar Merlo Support Bot',
    description: 'Learn about brand strategy, brand equity, and brand management. This AI assistant is trained to help with your Brand Management studies.',
    backgroundColor: 'from-purple-50 to-pink-50',
    primaryColor: 'purple',
    samplePrompts: [
      "What are the key elements of a strong brand identity?",
      "How do you measure and build brand equity?",
      "Explain the concept of brand positioning and differentiation",
      "What role does brand management play in business strategy?"
    ]
  },
  {
    id: 'OmarBotSMM',
    name: 'OmarBot Strategic Marketing',
    module: 'Strategic Marketing Management',
    program: 'Strategic Marketing Online',
    assistantId: 'asst_opIj7dFgXV7h1LG2Blz3bDVG',
    instructor: 'Omar Merlo Support Bot',
    description: 'Master strategic marketing concepts and frameworks. This AI assistant is trained to help with your Strategic Marketing Management studies.',
    backgroundColor: 'from-green-50 to-emerald-50',
    primaryColor: 'green',
    samplePrompts: [
      "How do you develop a comprehensive marketing strategy?",
      "What is the role of competitive analysis in strategic marketing?",
      "Explain market segmentation and targeting strategies",
      "How do you align marketing strategy with business objectives?"
    ]
  },
  {
    id: 'OmarBotSCRM',
    name: 'OmarBot Services & CRM',
    module: 'Services and Customer Relationship Management',
    program: 'Strategic Marketing Online',
    assistantId: 'asst_GHnZv1rU31arOasLdS8NezdE',
    instructor: 'Omar Merlo Support Bot',
    description: 'Explore services marketing and customer relationship management. This AI assistant is trained to help with your Services and CRM studies.',
    backgroundColor: 'from-orange-50 to-red-50',
    primaryColor: 'orange',
    samplePrompts: [
      "What are the unique characteristics of services marketing?",
      "How do you build and maintain strong customer relationships?",
      "Explain the customer journey and touchpoint management",
      "What strategies work best for service quality management?"
    ]
  },
  {
    id: 'PennyBotBPS',
    name: 'PennyBot Business Problem Solving',
    module: 'Business Problem Solving',
    program: 'Global MBA',
    assistantId: 'asst_DnW6iiU6F1xzF1giu4acyg8t',
    instructor: 'Penny Support Bot',
    description: 'Develop critical thinking and problem-solving skills for complex business challenges. This AI assistant is trained to help with your Business Problem Solving studies.',
    backgroundColor: 'from-teal-50 to-cyan-50',
    primaryColor: 'teal',
    samplePrompts: [
      "What framework should I use to analyze complex business problems?",
      "How do you structure problem-solving in ambiguous situations?",
      "What are the key steps in effective decision-making?",
      "How do you balance analytical and creative thinking in business?"
    ]
  },
  {
    id: 'JonathanBotFTMBAME',
    name: 'JonathanBot Managerial Economics',
    module: 'Managerial Economics',
    program: 'Full-time MBA',
    assistantId: 'asst_Qk17WHJffWzPYbXzXrNsakfi',
    instructor: 'Jonathan Support Bot',
    description: 'Master economic principles and decision-making frameworks for managers. This AI assistant is trained to help with your Managerial Economics studies.',
    backgroundColor: 'from-amber-50 to-yellow-50',
    primaryColor: 'amber',
    samplePrompts: [
      "How do supply and demand forces affect pricing decisions?",
      "What is game theory and how does it apply to business strategy?",
      "Explain the concept of elasticity and its managerial implications",
      "How do you analyze cost structures for optimal decision-making?"
    ]
  },
  {
    id: 'BartBotEMBAEntre',
    name: 'BartBot Entrepreneurship',
    module: 'Entrepreneurship',
    program: 'Executive MBA',
    assistantId: 'asst_s5xLxDB4l2K4dRs9dAlrg316',
    instructor: 'Bart Support Bot',
    description: 'Learn entrepreneurship fundamentals and startup strategies. This AI assistant is trained to help with your Entrepreneurship studies.',
    backgroundColor: 'from-indigo-50 to-purple-50',
    primaryColor: 'indigo',
    samplePrompts: [
      "What are the key elements of a successful business plan?",
      "How do you validate a business idea and find product-market fit?",
      "What funding options are available for startups?",
      "How do you build and lead an entrepreneurial team?"
    ]
  }
];

export const getBotById = (id: string): BotConfig | undefined => {
  return bots.find(bot => bot.id === id);
};

export const getBotByAssistantId = (assistantId: string): BotConfig | undefined => {
  return bots.find(bot => bot.assistantId === assistantId);
};