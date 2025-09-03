import React from 'react';
import { MessageCircle } from 'lucide-react';

interface SamplePromptsProps {
  samplePrompts: string[];
  onPromptClick: (prompt: string) => void;
}

const SamplePrompts: React.FC<SamplePromptsProps> = ({ samplePrompts, onPromptClick }) => {
  return (
    <div className="w-full max-w-4xl">
      <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
        Get started with these sample questions:
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {samplePrompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptClick(prompt)}
            className="group p-4 text-left bg-white border border-imperial-teal/30 rounded-lg hover:border-imperial-teal hover:bg-imperial-teal/5 transition-all duration-200 transform hover:scale-[1.02] shadow-sm hover:shadow-md"
          >
            <div className="flex items-start">
              <MessageCircle className="h-5 w-5 text-imperial-teal mr-3 mt-0.5 group-hover:text-imperial-navy" />
              <p className="text-sm text-gray-700 group-hover:text-gray-900 leading-relaxed">
                {prompt}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SamplePrompts;