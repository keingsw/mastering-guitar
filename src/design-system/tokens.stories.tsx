import type { Meta, StoryObj } from '@storybook/react';
import { colors, typography, componentTokens, musicalSpacing, wcagCompliance } from './tokens';

const meta: Meta = {
  title: 'Design System/Design Tokens',
  parameters: {
    docs: {
      description: {
        component: 'Design tokens are the foundation of our design system, providing consistent values for colors, typography, spacing, and other design decisions.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Colors: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', fontFamily: 'Inter', fontSize: '24px', fontWeight: '600' }}>Color Palette</h2>
      
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', fontFamily: 'Inter', fontSize: '18px', fontWeight: '500' }}>Primary Colors</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {Object.entries(colors.primary).map(([key, value]) => (
            <div key={key} style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                backgroundColor: value, 
                borderRadius: '8px',
                marginBottom: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}></div>
              <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '2px' }}>{key}</div>
              <div style={{ fontSize: '10px', color: '#666', fontFamily: 'monospace' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', fontFamily: 'Inter', fontSize: '18px', fontWeight: '500' }}>Music Theory Colors</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {Object.entries(colors.theory).map(([functionName, functionColors]) => (
            <div key={functionName}>
              <h4 style={{ 
                marginBottom: '12px', 
                fontFamily: 'Inter', 
                fontSize: '14px', 
                fontWeight: '500',
                textTransform: 'capitalize'
              }}>
                {functionName}
              </h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                {Object.entries(functionColors).map(([shade, color]) => (
                  <div key={shade} style={{ textAlign: 'center' }}>
                    <div style={{ 
                      width: '60px', 
                      height: '60px', 
                      backgroundColor: color, 
                      borderRadius: '6px',
                      marginBottom: '6px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}></div>
                    <div style={{ fontSize: '10px', fontWeight: '500' }}>{shade}</div>
                    <div style={{ fontSize: '9px', color: '#666', fontFamily: 'monospace' }}>{color}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '16px', fontFamily: 'Inter', fontSize: '18px', fontWeight: '500' }}>Neutral Colors</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {Object.entries(colors.neutral).map(([key, value]) => (
            <div key={key} style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                backgroundColor: value, 
                borderRadius: '6px',
                marginBottom: '6px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                border: key === '50' ? '1px solid #e5e7eb' : 'none'
              }}></div>
              <div style={{ fontSize: '10px', fontWeight: '500' }}>{key}</div>
              <div style={{ fontSize: '9px', color: '#666', fontFamily: 'monospace' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', fontFamily: 'Inter', fontSize: '24px', fontWeight: '600' }}>Typography System</h2>
      
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', fontFamily: 'Inter', fontSize: '18px', fontWeight: '500' }}>Font Families</h3>
        <div style={{ display: 'grid', gap: '16px' }}>
          <div style={{ padding: '16px', backgroundColor: '#fafafa', borderRadius: '8px' }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Sans-serif (UI)</div>
            <div style={{ fontFamily: typography.fontFamily.sans, fontSize: '24px', marginBottom: '4px' }}>
              The quick brown fox jumps over the lazy dog
            </div>
            <div style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>
              {typography.fontFamily.sans}
            </div>
          </div>
          <div style={{ padding: '16px', backgroundColor: '#fafafa', borderRadius: '8px' }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Monospace (Code & Music)</div>
            <div style={{ fontFamily: typography.fontFamily.mono, fontSize: '24px', marginBottom: '4px' }}>
              Cmaj7 F#dim Am7 B♭sus4
            </div>
            <div style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>
              {typography.fontFamily.mono}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', fontFamily: 'Inter', fontSize: '18px', fontWeight: '500' }}>Font Sizes</h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {Object.entries(typography.fontSize).map(([key, value]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
              <div style={{ 
                width: '80px', 
                fontSize: '12px', 
                color: '#666',
                fontFamily: 'monospace'
              }}>
                {key}
              </div>
              <div style={{ 
                fontSize: value, 
                fontFamily: 'Inter',
                lineHeight: typography.lineHeight[key === 'xs' ? 'tight' : key === 'sm' ? 'normal' : 'relaxed']
              }}>
                Sample text at {value}
              </div>
              <div style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '16px', fontFamily: 'Inter', fontSize: '18px', fontWeight: '500' }}>Font Weights</h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {Object.entries(typography.fontWeight).map(([key, value]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '80px', 
                fontSize: '12px', 
                color: '#666',
                fontFamily: 'monospace'
              }}>
                {key}
              </div>
              <div style={{ 
                fontSize: '18px', 
                fontFamily: 'Inter',
                fontWeight: value
              }}>
                Sample text with {key} weight
              </div>
              <div style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', fontFamily: 'Inter', fontSize: '24px', fontWeight: '600' }}>Spacing System</h2>
      
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', fontFamily: 'Inter', fontSize: '18px', fontWeight: '500' }}>Musical Spacing</h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px', lineHeight: '1.5' }}>
          Specialized spacing values optimized for guitar interfaces and music education.
        </p>
        <div style={{ display: 'grid', gap: '16px' }}>
          {Object.entries(musicalSpacing).map(([category, values]) => (
            <div key={category} style={{ 
              padding: '16px', 
              backgroundColor: '#fafafa', 
              borderRadius: '8px'
            }}>
              <h4 style={{ 
                marginBottom: '12px', 
                fontFamily: 'Inter', 
                fontSize: '14px', 
                fontWeight: '500',
                textTransform: 'capitalize'
              }}>
                {category}
              </h4>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {Object.entries(values).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: typeof value === 'string' ? value : `${value}px`,
                      height: '20px',
                      backgroundColor: colors.primary.DEFAULT,
                      borderRadius: '2px'
                    }}></div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {key}: {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const ComponentTokens: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', fontFamily: 'Inter', fontSize: '24px', fontWeight: '600' }}>Component Tokens</h2>
      
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', fontFamily: 'Inter', fontSize: '18px', fontWeight: '500' }}>Border Radius</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {Object.entries(componentTokens.borderRadius).map(([key, value]) => (
            <div key={key} style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                backgroundColor: colors.primary.light, 
                borderRadius: value,
                marginBottom: '8px'
              }}></div>
              <div style={{ fontSize: '12px', fontWeight: '500' }}>{key}</div>
              <div style={{ fontSize: '10px', color: '#666', fontFamily: 'monospace' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', fontFamily: 'Inter', fontSize: '18px', fontWeight: '500' }}>Shadows</h3>
        <div style={{ display: 'grid', gap: '16px' }}>
          {Object.entries(componentTokens.shadows).map(([key, value]) => (
            <div key={key} style={{ 
              padding: '20px', 
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: value,
              border: '1px solid #f0f0f0'
            }}>
              <div style={{ fontWeight: '500', marginBottom: '4px' }}>{key}</div>
              <div style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '16px', fontFamily: 'Inter', fontSize: '18px', fontWeight: '500' }}>Animation</h3>
        <div style={{ display: 'grid', gap: '16px' }}>
          <div style={{ padding: '16px', backgroundColor: '#fafafa', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Duration</h4>
            <div style={{ display: 'flex', gap: '16px' }}>
              {Object.entries(componentTokens.animation.duration).map(([key, value]) => (
                <div key={key} style={{ fontSize: '12px' }}>
                  <span style={{ fontWeight: '500' }}>{key}:</span>{' '}
                  <span style={{ fontFamily: 'monospace', color: '#666' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: '16px', backgroundColor: '#fafafa', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Easing</h4>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {Object.entries(componentTokens.animation.easing).map(([key, value]) => (
                <div key={key} style={{ fontSize: '12px' }}>
                  <span style={{ fontWeight: '500' }}>{key}:</span>{' '}
                  <span style={{ fontFamily: 'monospace', color: '#666' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const WCAGCompliance: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', fontFamily: 'Inter', fontSize: '24px', fontWeight: '600' }}>WCAG Compliance</h2>
      
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', fontFamily: 'Inter', fontSize: '18px', fontWeight: '500' }}>Text on Background Combinations</h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px', lineHeight: '1.5' }}>
          All text-background combinations meet WCAG 2.1 AA contrast ratio requirements (4.5:1 minimum).
        </p>
        <div style={{ display: 'grid', gap: '12px' }}>
          {wcagCompliance.textOnBackground.map(({ text, background, ratio }, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center',
              padding: '12px 16px',
              backgroundColor: background,
              color: text,
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              <div style={{ flex: 1 }}>Sample text content</div>
              <div style={{ 
                fontSize: '12px', 
                opacity: 0.8,
                fontFamily: 'monospace'
              }}>
                Ratio: {ratio}:1
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '16px', fontFamily: 'Inter', fontSize: '18px', fontWeight: '500' }}>Music Theory Color Contrast</h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px', lineHeight: '1.5' }}>
          Theory function colors with white text meet contrast requirements for readability.
        </p>
        <div style={{ display: 'grid', gap: '12px' }}>
          {wcagCompliance.theoryContrast.map(({ text, background, ratio, name }, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center',
              padding: '12px 16px',
              backgroundColor: background,
              color: text,
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              <div style={{ flex: 1 }}>
                <span style={{ marginRight: '12px' }}>{name} Function</span>
                {name === 'Root' && <span style={{ fontSize: '16px' }}>●</span>}
                {name === 'Third' && <span style={{ fontSize: '16px' }}>◆</span>}
                {name === 'Fifth' && <span style={{ fontSize: '16px' }}>▲</span>}
              </div>
              <div style={{ 
                fontSize: '12px', 
                opacity: 0.9,
                fontFamily: 'monospace'
              }}>
                Ratio: {ratio}:1
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};