import React from 'react';
import ThemeToggle from './ThemeToggle/ThemeToggle';
import { themeVarStyles } from '../utils/themeUtils';

const ThemeTest = () => {
  return (
    <div className="p-6 min-h-screen" style={themeVarStyles.background}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold" style={themeVarStyles.text}>
            Theme Test Page
          </h1>
          <ThemeToggle />
        </div>
        
        {/* Theme Color Showcase */}
        <div className="p-6 rounded-lg border" style={themeVarStyles.card}>
          <h2 className="text-xl font-semibold mb-4" style={themeVarStyles.text}>
            Theme Colors Showcase
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded border" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
              <div className="w-full h-16 rounded mb-2" style={{ backgroundColor: 'var(--bg)' }}></div>
              <p className="text-sm" style={themeVarStyles.text}>Background</p>
            </div>
            
            <div className="p-4 rounded border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="w-full h-16 rounded mb-2" style={{ backgroundColor: 'var(--card)' }}></div>
              <p className="text-sm" style={themeVarStyles.text}>Card</p>
            </div>
            
            <div className="p-4 rounded border" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
              <div className="w-full h-16 rounded mb-2" style={{ backgroundColor: 'var(--accent)' }}></div>
              <p className="text-sm">Accent</p>
            </div>
            
            <div className="p-4 rounded border" style={{ backgroundColor: 'var(--hover)', borderColor: 'var(--border)' }}>
              <div className="w-full h-16 rounded mb-2" style={{ backgroundColor: 'var(--hover)' }}></div>
              <p className="text-sm" style={themeVarStyles.text}>Hover</p>
            </div>
            
            <div className="p-4 rounded border" style={{ backgroundColor: 'var(--soft)', borderColor: 'var(--border)' }}>
              <div className="w-full h-16 rounded mb-2" style={{ backgroundColor: 'var(--soft)' }}></div>
              <p className="text-sm" style={themeVarStyles.text}>Soft</p>
            </div>
            
            <div className="p-4 rounded border" style={{ backgroundColor: 'var(--brand)', color: 'white' }}>
              <div className="w-full h-16 rounded mb-2" style={{ backgroundColor: 'var(--brand)' }}></div>
              <p className="text-sm">Brand</p>
            </div>
          </div>
        </div>
        
        {/* UI Components Test */}
        <div className="p-6 rounded-lg border space-y-4" style={themeVarStyles.card}>
          <h2 className="text-xl font-semibold" style={themeVarStyles.text}>
            UI Components Test
          </h2>
          
          <div className="space-y-3">
            <input 
              type="text" 
              placeholder="Test input field"
              className="w-full px-3 py-2 border rounded-lg"
              style={themeVarStyles.input}
            />
            
            <div className="flex gap-3">
              <button 
                className="px-4 py-2 border rounded-lg transition-colors"
                style={themeVarStyles.button}
              >
                Default Button
              </button>
              
              <button 
                className="px-4 py-2 rounded-lg transition-colors"
                style={themeVarStyles.primaryButton}
              >
                Primary Button
              </button>
            </div>
            
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
              <p style={themeVarStyles.text}>
                This is a hover background example with theme-aware colors.
              </p>
              <p className="text-sm mt-2" style={themeVarStyles.mutedText}>
                This is muted text that should be less prominent.
              </p>
            </div>
          </div>
        </div>
        
        {/* Instructions */}
        <div className="p-6 rounded-lg border" style={themeVarStyles.card}>
          <h2 className="text-xl font-semibold mb-4" style={themeVarStyles.text}>
            Theme Test Instructions
          </h2>
          <ul className="space-y-2" style={themeVarStyles.text}>
            <li>• Use the toggle button above to switch between light and dark themes</li>
            <li>• All colors should transition smoothly</li>
            <li>• Text should remain readable in both themes</li>
            <li>• Borders and backgrounds should adapt appropriately</li>
            <li>• The theme preference should persist in localStorage</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ThemeTest;