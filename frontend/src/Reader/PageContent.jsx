import React from "react";

function PageContent({ page }) {
  if (!page) return null;

  // Render a line with markdown formatting
  const renderLine = (line, index) => {
    const trimmed = line.trim();

    // Main heading (##)
    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={index} style={{
          fontSize: '1.3em',
          fontWeight: 'bold',
          marginTop: 20,
          marginBottom: 12,
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: 6
        }}>
          {trimmed.substring(3)}
        </h2>
      );
    }

    // Subheading (###)
    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={index} style={{
          fontSize: '1.1em',
          fontWeight: '600',
          marginTop: 16,
          marginBottom: 10,
          color: '#374151'
        }}>
          {trimmed.substring(4)}
        </h3>
      );
    }

    // Bullet point (•) or (-)
    if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
      const text = trimmed.substring(2);
      return (
        <div key={index} style={{
          marginLeft: 20,
          marginBottom: 10,
          display: 'flex',
          lineHeight: 1.7
        }}>
          <span style={{ marginRight: 10, fontWeight: 'bold' }}>•</span>
          <span dangerouslySetInnerHTML={{ __html: formatBoldText(text) }} />
        </div>
      );
    }

    // Numbered list (1. 2. 3.)
    if (/^\d+\.\s/.test(trimmed)) {
      return (
        <div key={index} style={{
          marginLeft: 20,
          marginBottom: 10,
          display: 'flex',
          lineHeight: 1.7
        }}>
          <span style={{ marginRight: 10, fontWeight: 'bold', minWidth: 24 }}>
            {trimmed.match(/^\d+\./)[0]}
          </span>
          <span dangerouslySetInnerHTML={{
            __html: formatBoldText(trimmed.replace(/^\d+\.\s/, ''))
          }} />
        </div>
      );
    }

    // Regular paragraph
    if (trimmed) {
      return (
        <p key={index} style={{
          marginBottom: 14,
          lineHeight: 1.8,
          textAlign: 'justify'
        }} dangerouslySetInnerHTML={{ __html: formatBoldText(trimmed) }} />
      );
    }

    // Empty line for spacing
    return <div key={index} style={{ height: 8 }} />;
  };

  // Format bold text (**text**)
  const formatBoldText = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  return (
    <div className="page-content" style={{ padding: '24px 32px' }}>
      {page.text.map((line, i) => renderLine(line, i))}
    </div>
  );
}

export default PageContent;