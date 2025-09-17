import React from 'react';
import FacultyEvaluation from './FacultyEvaluation';

// Wrapper component for evaluation functionality
// This bridges the gap between Main.jsx import expectations and the actual FacultyEvaluation component
const Evaluation = ({ evaluations, onSaveMarks, ...props }) => {
  return (
    <FacultyEvaluation 
      initialEvaluations={evaluations} 
      onSaveMarks={onSaveMarks}
      {...props}
    />
  );
};

export default Evaluation;