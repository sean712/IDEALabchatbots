import React from 'react';
import { Mail, MapPin, Award } from 'lucide-react';

const ProfessorSidebar: React.FC = () => {
  return (
    <div className="w-80 bg-white rounded-lg shadow-md border border-gray-100 p-6 h-[80vh] overflow-y-auto">
      <div className="text-center mb-6">
        <img 
          src="/Omar Merlo.jpg" 
          alt="Professor Omar Merlo" 
          className="w-32 h-32 mx-auto mb-4 rounded-full object-cover border-4 border-imperial-teal/20"
        />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Professor Omar Merlo</h3>
        <p className="text-imperial-teal font-medium mb-2">Module Leader</p>
        <p className="text-gray-600 text-sm">Marketing Management</p>
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-center text-sm text-gray-600">
          <Award className="h-4 w-4 mr-2 text-imperial-teal" />
          <span>Global Online MBA Programme</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2 text-imperial-teal" />
          <span>Imperial Business School</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="h-4 w-4 mr-2 text-imperial-teal" />
          <span>Available for consultation</span>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-900 mb-3">About</h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          Professor Omar Merlo is the module leader for Marketing Management in the Global Online MBA programme at Imperial Business School. With extensive expertise in marketing strategy, consumer behavior, and digital marketing, Professor Merlo is here to guide you through your marketing management studies.
        </p>
      </div>
      
      <div className="border-t pt-4 mt-4">
        <h4 className="font-semibold text-gray-900 mb-3">Office Hours</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Available for chat assistance</p>
          <p className="text-imperial-teal font-medium">24/7 via OmarBot</p>
        </div>
      </div>
    </div>
  );
};

export default ProfessorSidebar;