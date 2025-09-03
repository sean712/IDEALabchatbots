import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, GraduationCap, Users } from 'lucide-react';
import { bots } from '../config/bots';

const LandingPage: React.FC = () => {
  const groupedBots = bots.reduce((acc, bot) => {
    if (!acc[bot.program]) {
      acc[bot.program] = [];
    }
    acc[bot.program].push(bot);
    return acc;
  }, {} as Record<string, typeof bots>);

  const getProgramIcon = (program: string) => {
    switch (program) {
      case 'Global MBA':
        return <GraduationCap className="h-6 w-6" />;
      case 'Specialized Masters':
        return <Users className="h-6 w-6" />;
      case 'Executive MBA':
        return <Bot className="h-6 w-6" />;
      default:
        return <Bot className="h-6 w-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Imperial Business School AI Teaching Assistants
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get personalized support from our AI-powered teaching assistants. Each bot is tailored to specific modules and designed to enhance your learning experience.
          </p>
        </div>

        <div className="space-y-12">
          {Object.entries(groupedBots).map(([program, programBots]) => (
            <div key={program}>
              <div className="flex items-center mb-6">
                <div className="text-imperial-teal mr-3">
                  {getProgramIcon(program)}
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">{program}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programBots.map((bot) => (
                  <Link
                    key={bot.id}
                    to={`/bot/${bot.id}`}
                    className="block transform transition-all duration-200 hover:scale-105"
                  >
                    <div className={`bg-gradient-to-br ${bot.backgroundColor} rounded-xl p-6 shadow-lg hover:shadow-xl border border-gray-200`}>
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-white shadow-sm mr-3 flex items-center justify-center border-2 border-white">
                          <Bot className="h-6 w-6 text-imperial-teal" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {bot.name}
                          </h3>
                          <p className="text-sm text-gray-600">{bot.instructor}</p>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-${bot.primaryColor}-100 text-${bot.primaryColor}-800`}>
                          {bot.module}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {bot.description}
                      </p>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Click to start chatting
                        </span>
                        <Bot className={`h-4 w-4 text-${bot.primaryColor}-500`} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg p-8 shadow-md max-w-2xl mx-auto">
            <Bot className="h-12 w-12 text-imperial-teal mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              How It Works
            </h3>
            <p className="text-gray-600 mb-4">
              Each AI teaching assistant has been specifically trained on their respective modules. 
              Click on any bot above to start a conversation and get personalized help with your studies.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <span>• 24/7 Availability</span>
              <span>• Module-Specific Knowledge</span>
              <span>• Instant Responses</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;